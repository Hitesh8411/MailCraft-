const express = require("express");
const { sendEmail, delay } = require("../helpers/mailer");
const authMiddleware = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");
const EmailLog = require("../models/EmailLog");
const router = express.Router();
router.use(authMiddleware); // Protect all routes in email.js

// Single Email
router.post("/send", validateRequest(['to', 'subject', 'html']), async (req, res, next) => {
  const { to, subject, html, name } = req.body;
  const recipientName = name || "Customer";
  const personalizedHtml = html.replace(/{{Name}}/g, recipientName);

  try {
    await sendEmail({ to, subject, html: personalizedHtml });
    console.log(`[SUCCESS] Single email sent to ${to}`);
    
    // Log success
    await EmailLog.create({
      email: to,
      name: recipientName,
      subject: subject,
      status: "sent",
      error: null
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(`[ERROR] Single email failed for ${to}:`, err.message);
    
    // Log failure
    await EmailLog.create({
      email: to,
      name: recipientName,
      subject: subject,
      status: "failed",
      error: err.message
    });

    next(err);
  }
});


// Bulk Email
router.post("/bulk", validateRequest(['recipients', 'subject', 'html']), async (req, res, next) => {
  const { recipients, subject, html } = req.body;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, message: "No valid recipients provided" });
  }

  const results = [];
  
      try {
    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
      const emailObj = {
        name: recipient.name || "Customer",
        email: recipient.email
      };
      
      const personalizedHtml = html.replace(/{{Name}}/g, emailObj.name);

      let sentSuccessfully = false;
      let errorMsg = null;

      // Retry logic (up to 2 tries)
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          await sendEmail({ to: emailObj.email, subject, html: personalizedHtml });
          sentSuccessfully = true;
          console.log(`[SUCCESS] Bulk email sent to ${emailObj.email}`);
          break; // break out of retry loop on success
        } catch (e) {
          errorMsg = e.message;
          console.log(`[RETRY] Attempt ${attempt + 1} failed for ${emailObj.email}:`, e.message);
          if (attempt === 0) await delay(500); // 500ms wait before next try
        }
      }

      const status = sentSuccessfully ? "sent" : "failed";

      // Track in DB
      await EmailLog.create({
        email: emailObj.email,
        name: emailObj.name,
        subject: subject,
        status: status,
        error: sentSuccessfully ? null : errorMsg
      });

      results.push({ email: emailObj.email, status, error: sentSuccessfully ? null : errorMsg });
      if (!sentSuccessfully) {
         console.error(`[ERROR] Bulk email permanently failed for ${emailObj.email}:`, errorMsg);
      }
      
      // Delay to avoid limits (Gmail rate limiting)
      await delay(200); 

      // Batching: Pause longer after every 10 emails
      if ((i + 1) % 10 === 0 && i !== recipients.length - 1) {
          console.log(`[INFO] Batch of 10 reached. Pausing for rate limits...`);
          await delay(3000); // 3 second pause between batches
      }
    }

    res.json({ success: true, message: "Bulk sending complete", results });
  } catch (err) {
    console.error("[ERROR] Critical failure in bulk email process:", err.message);
    next(err);
  }
});

// Fetch Email Logs
router.get("/logs", async (req, res, next) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    console.error("[ERROR] Failed to fetch email logs:", err.message);
    next(err);
  }
});

module.exports = router;
