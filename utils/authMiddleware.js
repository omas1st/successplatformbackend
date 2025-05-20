const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Not authorized" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminProtect = (req, res, next) => {
  const { username, password } = req.body.admin || {};
  if (username?.toLowerCase() === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD) {
    return next();
  }
  res.status(403).json({ message: "Admin credentials required" });
};

module.exports = { protect, adminProtect };
