require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();
const app = express();

// Configure CORS for production
app.use(cors({
  origin: [
    "https://successplatform.vercel.app/", // Your frontend URL
    "http://localhost:3000" // Local development
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));

// Existing route setup
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/lotto", require("./routes/lottoRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
