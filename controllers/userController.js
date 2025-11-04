const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const sendMail = require("../utils/mailer");

exports.register = async (req, res) => {
  try {
    const { username, password, ...rest } = req.body;
    if (await User.findOne({ username: username.toLowerCase() })) {
      return res.status(400).json({ message: "Username taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...rest,
      username: username.toLowerCase(),
      password: hashed,
      isAdmin: false // Ensure new users are not admins by default
      // premium defaults come from schema
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
    await sendMail(
      "Success winning platform",
      `A new user has registered:\n\nUsername: ${user.username}\nEmail: ${user.email}\nWhatsApp: ${user.whatsapp}\nTime: ${new Date().toUTCString()}`
    );

    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ token, user: safeUser });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if credentials match admin credentials from environment
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'omas';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'omas';
    
    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
      // Admin login - find or create admin user
      let adminUser = await User.findOne({ username: ADMIN_USERNAME.toLowerCase() });
      
      if (!adminUser) {
        // Create admin user if doesn't exist
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        adminUser = await User.create({
          username: ADMIN_USERNAME.toLowerCase(),
          password: hashedPassword,
          isAdmin: true,
          fullName: "Administrator",
          email: "admin@example.com",
          whatsapp: "0000000000",
          occupation: "Administrator",
          age: 30,
          country: "Unknown",
          maritalStatus: "male"
        });
      } else {
        // Update existing user to be admin
        adminUser.isAdmin = true;
        await adminUser.save();
      }

      const token = jwt.sign({ id: adminUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
      await sendMail(
        "Success winning platform",
        `Admin has logged in:\n\nUsername: ${adminUser.username}\nTime: ${new Date().toUTCString()}`
      );

      const safeUser = adminUser.toObject();
      delete safeUser.password;
      return res.json({ token, user: safeUser });
    }

    // Regular user login
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
    await sendMail(
      "Success winning platform",
      `A user has logged in:\n\nUsername: ${user.username}\nEmail: ${user.email}\nWhatsApp: ${user.whatsapp}\nTime: ${new Date().toUTCString()}`
    );

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ token, user: safeUser });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: e.message });
  }
};

exports.getMe = (req, res) => {
  const safeUser = req.user.toObject();
  delete safeUser.password;
  res.json(safeUser);
};

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  await require("../models/Message").create({
    from: req.user._id,
    body: message
  });
  await sendMail("Success Uk49s User Message", message);
  res.json({ message: "Sent" });
};
