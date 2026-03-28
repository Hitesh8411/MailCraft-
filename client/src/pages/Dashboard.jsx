import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, successRate: 0 });

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/api/email/logs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        const total = data.logs.length;
        const sent = data.logs.filter(l => l.status === "sent").length;
        const failed = total - sent;
        const successRate = total ? Math.round((sent / total) * 100) : 0;
        setStats({ total, sent, failed, successRate });
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!user || !token) {
      navigate("/signin");
    } else {
      setIsAuth(true);
      fetchLogs();
    }
    setIsLoadingAuth(false);
  }, [navigate]);

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1000px] bg-base-100 p-8 shadow-lg rounded-lg border border-base-200">
              <h1 className="mb-8 text-3xl font-bold sm:text-4xl text-left border-b pb-4">Performance Overview</h1>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="stat bg-base-200 rounded-box shadow border border-base-300">
                  <div className="stat-title">Total Processed</div>
                  <div className="stat-value text-primary">{stats.total}</div>
                </div>
                <div className="stat bg-base-200 rounded-box shadow border border-base-300">
                  <div className="stat-title">Success Rate</div>
                  <div className="stat-value text-info">{stats.successRate}%</div>
                </div>
                <div className="stat bg-base-200 rounded-box shadow border border-base-300">
                  <div className="stat-title text-success">Total Sent</div>
                  <div className="stat-value text-success">{stats.sent}</div>
                </div>
                <div className="stat bg-base-200 rounded-box shadow border border-base-300">
                  <div className="stat-title text-error">Total Failed</div>
                  <div className="stat-value text-error">{stats.failed}</div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Dispatches (Global)</h3>
                <div className="overflow-x-auto bg-base-200 rounded-lg max-h-[500px] shadow-inner border border-base-300">
                  <table className="table table-pin-rows w-full text-sm">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Error Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length > 0 ? logs.map((res, idx) => (
                          <tr key={idx} className={res.status === "sent" ? "bg-success/5" : "bg-error/5"}>
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
                      )) : (
                        <tr>
                          <td colSpan="3" className="text-center py-8 text-gray-500">No campaigns launched yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

      </div>
    </div>
  );
};

export default Dashboard;
