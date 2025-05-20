// backend/server.js

require("dotenv").config();         // load .env before anything
const express   = require("express");
const cors      = require("cors");
const connectDB = require("./config/db");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => res.send("API is running"));

// public routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/lotto", require("./routes/lottoRoutes"));

// admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
