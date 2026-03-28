import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { emailTemplates as systemTemplates } from "../components/templatesData";

const EMPTY_FORM = { title: "", subject: "", html: "" };

const API = import.meta.env.VITE_API_URL;

const Templates = () => {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!user || !token) navigate("/signin");
  }, [navigate]);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ── Fetch user templates from DB ──────────────────────────
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/templates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTemplates(data.templates);
      else toast.error(data.message || "Failed to load templates");
    } catch {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ── Modal helpers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (template) => {
    setEditingTemplate(template);
    setForm({ title: template.title, subject: template.subject, html: template.html });
    setModalOpen(true);
  };

  // Pre-fill modal from a system template (clone to save as user copy)
  const openCustomize = (sysTemplate) => {
    setEditingTemplate(null); // always creates a NEW user copy
    setForm({
      title: sysTemplate.name,
      subject: sysTemplate.subject,
      html: sysTemplate.body,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
  };

  // ── Save (Create or Edit) ─────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim() || !form.subject.trim() || !form.html.trim()) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingTemplate
        ? `${API}/api/templates/${editingTemplate._id}`
        : `${API}/api/templates`;
      const method = editingTemplate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      toast.success(editingTemplate ? "Template updated!" : "Template saved to My Templates!");
      closeModal();
      fetchTemplates();
    } catch (err) {
      toast.error(err.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Template deleted");
      setDeleteConfirm(null);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete template");
    }
  };

  // ── Use Template → navigate to Campaigns ─────────────────
  const handleUse = (subject, html) => {
    navigate("/campaigns", { state: { subject, html } });
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 border-b border-base-300 pb-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Email Templates</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Use system templates or create your own. Use{" "}
            <code className="bg-base-200 px-1 rounded">{"{{Name}}"}</code> for dynamic personalization.
          </p>
        </div>
        <button className="btn btn-primary gap-2" onClick={openCreate}>
          <span className="text-lg leading-none">＋</span> New Template
        </button>
      </div>

      {/* ══ SECTION 1: System Templates ══════════════════════ */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">📦 System Templates</h2>
          <span className="badge badge-secondary badge-outline">Built-in</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Pre-built by MailCraft. Click <strong>Customize</strong> to save an editable copy to your library.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemTemplates.map((template) => (
            <div
              key={template.id}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="card-title text-base">{template.name}</h3>
                  <span className="badge badge-secondary badge-sm shrink-0">System</span>
                </div>

                <p className="text-sm text-gray-500 mb-3 truncate">
                  <span className="font-semibold text-base-content">Subject: </span>
                  {template.subject}
                </p>

                <div className="bg-base-200 rounded-lg p-3 font-mono text-xs text-gray-600 whitespace-pre-wrap line-clamp-3 overflow-hidden mb-4 shadow-inner">
                  {template.body}
                </div>

                <div className="card-actions justify-end gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUse(template.subject, template.body)}
                  >
                    Use
                  </button>
                  <button
                    className="btn btn-secondary btn-outline btn-sm"
                    onClick={() => openCustomize(template)}
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider text-gray-400 font-semibold text-sm">MY TEMPLATES</div>

      {/* ══ SECTION 2: My Templates ═══════════════════════════ */}
      <div className="mt-6">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-base-200 rounded-xl border border-dashed border-base-300 text-center">
            <span className="text-4xl mb-3">✍️</span>
            <h3 className="text-lg font-bold mb-2">No Custom Templates Yet</h3>
            <p className="text-gray-500 mb-5 max-w-sm text-sm">
              Create your own or click <strong>Customize</strong> on a system template above to start.
            </p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              Create Template
            </button>
          </div>
        )}

        {/* My Template Cards */}
        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="card bg-base-100 border border-primary/30 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="card-title text-base">{template.title}</h3>
                    <span className="badge badge-primary badge-outline shrink-0">My Template</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 truncate">
                    <span className="font-semibold text-base-content">Subject: </span>
                    {template.subject}
                  </p>

                  <div className="bg-base-200 rounded-lg p-3 font-mono text-xs text-gray-600 whitespace-pre-wrap line-clamp-3 overflow-hidden mb-4 shadow-inner">
                    {template.html}
                  </div>

                  {/* Delete confirm inline */}
                  {deleteConfirm === template._id ? (
                    <div className="flex items-center gap-2 bg-error/10 border border-error/30 rounded-lg p-3">
                      <span className="text-sm font-semibold text-error flex-1">Delete this template?</span>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDelete(template._id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="card-actions justify-end gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUse(template.subject, template.html)}
                      >
                        Use
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(template)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-outline btn-sm"
                        onClick={() => setDeleteConfirm(template._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL ────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl w-full">
            <h3 className="font-bold text-xl mb-1">
              {editingTemplate ? "✏️ Edit Template" : "➕ New Template"}
            </h3>
            {!editingTemplate && form.title && (
              <p className="text-sm text-secondary mb-5">
                Customizing a system template — this will be saved as your own editable copy.
              </p>
            )}
            {(!form.title || editingTemplate) && <div className="mb-5" />}

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Template Title</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Welcome Email, Promo Blast"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Email Subject</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Welcome to MailCraft!"
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">HTML / Text Content</span>
                <span className="label-text-alt text-gray-400">Use {"{{Name}}"} to personalize</span>
              </label>
              <textarea
                rows={10}
                className="textarea textarea-bordered w-full font-mono text-sm"
                value={form.html}
                onChange={(e) => setForm({ ...form, html: e.target.value })}
                placeholder={"Hi {{Name}},\n\nYour email body goes here...\n\nBest regards,\nThe Team"}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary min-w-[130px]" onClick={handleSave} disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Template"}
              </button>
            </div>
          </div>
          {/* Backdrop */}
          <div className="modal-backdrop bg-black/40" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default Templates;
