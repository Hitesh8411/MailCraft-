const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect DB
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to talk to backend

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/email", require("./routes/email"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/templates", require("./routes/templates"));

// Global Error Handler
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
