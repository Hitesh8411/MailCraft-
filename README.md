# 🚀 MailCraft – Email Automation Platform

## 🌐 Live Demo

👉 https://mail-craft-omega.vercel.app/

## 🧠 About

MailCraft is a full-stack MERN-based email automation platform that allows users to send personalized emails at scale using Excel uploads and reusable templates.

---

## ✨ Features

* 📧 Bulk email sending using Excel upload
* 🧩 Template-based email system
* 🔐 JWT Authentication
* 📊 Email tracking (success/failure logs)
* 🔁 Retry mechanism for failed emails
* ⚡ Rate limiting to prevent blocking

---

## 🛠 Tech Stack

* Frontend: React (Vite) + Tailwind CSS
* Backend: Node.js + Express
* Database: MongoDB Atlas
* Deployment: Vercel + Render

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/Hitesh8411/MailCraft.git
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Setup environment variables

Create `.env` file using `.env.example`

### 4. Run project

```bash
# frontend
cd client
npm run dev

# backend
cd server
npm start
```

---

## 🔐 Important Note

Environment variables are required to run this project. Do not expose secrets.

---

## 💡 Future Improvements

* AI email generator
* Email analytics (open/click tracking)
* Queue system (BullMQ)

---

## 👨‍💻 Author

Hitesh Suryavanshi
