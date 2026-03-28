const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Template = require("../models/Template");

// Protect all routes
router.use(authMiddleware);

// POST /api/templates — Create a new template
router.post("/", async (req, res) => {
  try {
    const { title, subject, html } = req.body;
    if (!title || !subject || !html) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const template = await Template.create({
      title,
      subject,
      html,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create template" });
  }
});

// GET /api/templates — Fetch all templates for logged-in user
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, templates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch templates" });
  }
});

// PUT /api/templates/:id — Update a template (ownership enforced)
router.put("/:id", async (req, res) => {
  try {
    const { title, subject, html } = req.body;
    if (!title || !subject || !html) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, subject, html },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update template" });
  }
});

// DELETE /api/templates/:id — Delete a template (ownership enforced)
router.delete("/:id", async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete template" });
  }
});

module.exports = router;
