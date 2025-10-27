require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();
const app = express();

// Configure CORS for production
app.use(cors({
  origin: [
    "https://uk49successplatform.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => res.send("API is running"));

// API root endpoint
app.get("/api", (req, res) => res.json({ 
  message: "UK49 Success Platform API", 
  status: "running",
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

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found",
    availableEndpoints: ["/api/users", "/api/lotto", "/api/admin"]
  });
});

// Handle all other routes (for SPA routing if needed)
app.get("*", (req, res) => {
  res.send("UK49 Success Platform Backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
