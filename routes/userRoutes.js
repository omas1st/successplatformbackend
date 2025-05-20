const router = require("express").Router();
const { register, login, getMe, sendMessage } = require("../controllers/userController");
const { protect } = require("../utils/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", protect, getMe);
router.post("/message", protect, sendMessage);

module.exports = router;
