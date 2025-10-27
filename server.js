require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();
const app = express();

// Configure CORS for production - REMOVE TRAILING SLASH from origin URL
app.use(cors({
  origin: [
    "https://uk49successplatform.vercel.app", // Removed trailing slash
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));

// Add this route for /api
app.get("/api", (req, res) => res.json({ 
  message: "UK49 Success Platform API", 
  endpoints: {
    users: "/api/users",
    lotto: "/api/lotto", 
    admin: "/api/admin"
  }
}));

// Existing route setup
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/lotto", require("./routes/lottoRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
