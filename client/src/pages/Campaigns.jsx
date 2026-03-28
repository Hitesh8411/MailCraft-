import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { useNavigate, useLocation } from "react-router-dom";
import { emailTemplates } from "../components/templatesData";

const API = import.meta.env.VITE_API_URL;

const Campaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    to: "",
    name: "",
    subject: "",
    html: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [excelRecipients, setExcelRecipients] = useState([]);
  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!user || !token) {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.selectedTemplate) {
      // Legacy: static template lookup by ID
      handleTemplateSelect(location.state.selectedTemplate);
    } else if (location.state?.subject || location.state?.html) {
      // New: dynamic template with direct subject + html payload
      setFormData(prev => ({
        ...prev,
        subject: location.state.subject || prev.subject,
        html: location.state.html || prev.html,
      }));
    }
  }, [location]);

  const handleTemplateSelect = (id) => {
    setSelectedTemplate(id);
    if (!id) return;
    const template = emailTemplates.find(t => t.id === id);
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        html: template.body
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast.error("Invalid file format. Please upload an Excel document.");
        return;
      }
      await parseExcel(file);
    }
  };

  const parseExcel = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const recipients = jsonData
          .map((row) => ({
            name: row.Name || row.name || "Customer",
            email: row.Email || row.email || "",
          }))
          .filter((r) => r.email);

        if (recipients.length === 0) {
          toast.error("No valid emails found! Ensure you have an 'Email' or 'email' column.");
          setExcelRecipients([]);
          return;
        }

        setExcelRecipients(recipients);
        toast.success(`Loaded ${recipients.length} valid recipients from Excel`);
      } catch (err) {
        toast.error("Failed to parse Excel file");
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBulkResults(null);

    try {
      // Format newlines safely into break tags
      const formattedHtml = formData.html.replace(/\n/g, '<br>');

      const endpoint = activeTab === "bulk" ? `${API}/api/email/bulk` : `${API}/api/email/send`;
      const payload = activeTab === "bulk" 
        ? { recipients: excelRecipients, subject: formData.subject, html: formattedHtml }
        : { to: formData.to, name: formData.name, subject: formData.subject, html: formattedHtml };

      if (activeTab === "bulk" && excelRecipients.length === 0) {
        throw new Error("No recipients loaded from Excel file.");
      }

      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Request failed");
      }

      toast.success(data.message || "Operation completed successfully!");
      
      if (activeTab === "single") {
         setFormData({ ...formData, to: "", name: "", subject: "", html: "" });
         setSelectedTemplate("");
      } else {
         if (data.results) {
           setBulkResults(data.results);
         }
         // Clear form values after bulk
         setFormData({ ...formData, subject: "", html: "" });
         setSelectedTemplate("");
         setExcelRecipients([]);
         document.getElementById('excel-upload').value = '';
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process request";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl text-left border-b border-base-300 pb-4">New Campaign</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form Side */}
          <div className="flex-1 bg-base-100 p-8 shadow-lg rounded-xl border border-base-300">
            <div className="tabs tabs-boxed mb-6 justify-center bg-base-200">
              <a 
                className={`tab ${activeTab === "single" ? "tab-active font-bold" : ""}`}
                onClick={() => { setActiveTab("single"); setBulkResults(null); }}
              >
                Single Dispatch
              </a> 
              <a 
                className={`tab ${activeTab === "bulk" ? "tab-active font-bold" : ""}`}
                onClick={() => { setActiveTab("bulk"); setBulkResults(null); }}
              >
                Bulk Upload
              </a>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* Template Selector Tool */}
              <div className="mb-6 bg-base-200 p-4 rounded-lg shadow-inner">
                <label className="block mb-2 text-sm font-semibold text-base-content">
                  Pre-load Template
                </label>
                <select 
                  className="select select-bordered w-full select-primary"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                >
                  <option value="">-- Custom Blank Draft --</option>
                  {emailTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {activeTab === "single" ? (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-base-content">
                      Recipient Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <p className="text-[10px] mt-1 text-gray-500">Used for {"{{Name}}"} replacement</p>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-base-content">
                      To (Email Address)
                    </label>
                    <input
                      type="email"
                      required
                      className="input input-bordered w-full"
                      placeholder="recipient@example.com"
                      value={formData.to}
                      onChange={(e) =>
                        setFormData({ ...formData, to: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-base-200 p-4 rounded-lg">
                  <label className="block mb-2 text-sm font-medium text-base-content">
                    Upload Excel File (Columns required: Name, Email)
                  </label>
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    required={excelRecipients.length === 0}
                    className="file-input file-input-bordered file-input-primary w-full"
                    onChange={handleFileChange}
                  />
                  <div className="mt-2 text-sm">
                    {excelRecipients.length > 0 ? (
                      <span className="text-success font-semibold">✓ {excelRecipients.length} valid recipients loaded. Ready to send.</span>
                    ) : (
                      <span className="text-gray-500">Awaiting .xlsx file. The system will skip rows without valid emails.</span>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-base-content">
                  Campaign Subject
                </label>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  placeholder="Subject of the email..."
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between">
                   <label className="block mb-2 text-sm font-medium text-base-content">
                     HTML Content
                   </label>
                </div>
                <p className="text-xs mb-2 text-gray-500">
                  {activeTab === "bulk" && "Pro Tip: Use {{Name}} anywhere in the HTML to dynamically personalize the email for each recipient!"}
                </p>
                <textarea
                  required
                  rows={10}
                  className="textarea textarea-bordered w-full font-sans text-sm"
                  placeholder={activeTab === "bulk" ? "Hi {{Name}},\n\nWelcome to our new platform..." : "Hello World"}
                  value={formData.html}
                  onChange={(e) =>
                    setFormData({ ...formData, html: e.target.value, selectedTemplate: "" })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-lg h-14 relative overflow-hidden shadow-xl"
                disabled={loading}
              >
                {loading && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                     <div className="h-full bg-white animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                )}
                {loading && <span className="loading loading-spinner z-10 mr-2"></span>}
                <span className="z-10">{loading ? "Processing campaign..." : activeTab === "bulk" ? `Launch Bulk Campaign (${excelRecipients.length} recipients)` : "Send Single Email"}</span>
              </button>
            </form>

            {bulkResults && (
              <div className="mt-8 border-t border-base-300 pt-6">
                <h3 className="text-xl font-bold mb-4">Delivery Report</h3>
                <div className="overflow-x-auto bg-base-200 rounded-lg max-h-80 shadow-inner">
                  <table className="table table-pin-rows w-full text-sm">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkResults.map((res, idx) => (
                         <tr key={idx} className={res.status === "sent" ? "bg-success/10" : "bg-error/10"}>
                            <td className="font-bold">
                              {res.status === "sent" ? (
                                <span className="text-success badge badge-success badge-outline badge-sm">SENT</span>
                              ) : (
                                <span className="text-error badge badge-error badge-outline badge-sm">FAILED</span>
                              )}
                            </td>
                            <td className="font-mono">{res.email}</td>
                            <td className="text-error text-xs max-w-xs truncate">{res.error || "-"}</td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Side */}
          <div className="flex-1 bg-base-100 p-8 shadow-lg rounded-xl border border-base-300 hidden lg:flex flex-col">
            <h2 className="mb-4 text-2xl font-bold flex items-center">
              <span className="bg-primary w-3 h-3 rounded-full mr-3 animate-pulse"></span>
              Live Preview
            </h2>
            <p className="text-sm text-gray-500 mb-6 pb-4 border-b">What your recipients will see in their inbox.</p>
            
            <div className="flex-1 bg-gray-50 border border-gray-200 p-8 rounded-lg shadow-inner overflow-y-auto" style={{ fontFamily: "Arial, sans-serif" }}>
              <div className="border-b border-gray-300 pb-4 mb-6">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Subject</p>
                <h3 className="text-xl text-gray-800 font-bold">{formData.subject || "No Subject"}</h3>
              </div>
              <div 
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ 
                  __html: (formData.html || "<p class='text-gray-400 italic'>Email body preview...</p>")
                            .replace(/\n/g, '<br>')
                            .replace(/{{Name}}/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded font-bold">John Doe</span>') 
                }} 
              />
            </div>
            <div className="mt-4 text-xs text-center text-gray-400">Rendered via built-in virtual DOM execution</div>
          </div>

        </div>
    </div>
  );
};

export default Campaigns;
