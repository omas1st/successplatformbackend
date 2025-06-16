const User = require("../models/User");
const LottoBall = require("../models/LottoBall");
const PastWinning = require("../models/PastWinning");
const Result = require("../models/Result");
const sendMail = require("../utils/mailer");

// List all users
exports.listUsers = (_, res) =>
  User.find().then(users => res.json(users));

// Update only the premium field on a user
exports.updateUser = (req, res) =>
  User.findByIdAndUpdate(
    req.params.id,
    { premium: req.body.premium },
    { new: true }
  ).then(u => res.json(u));

// Delete a user
exports.deleteUser = (req, res) =>
  User.findByIdAndDelete(req.params.id)
      .then(() => res.json({ message: "Deleted" }));

// Get editable balls for home page
exports.getBalls = async (_, res) => {
  const free = await LottoBall.findOne({ type: "free", date: { $gte: startOfToday() } });
  const lunchtime = await LottoBall.findOne({ type: "lunchtime", date: { $gte: startOfToday() } });
  const teatime = await LottoBall.findOne({ type: "teatime", date: { $gte: startOfToday() } });
  res.json({
    free: free.balls,
    premium: { lunchtime: lunchtime.balls, teatime: teatime.balls }
  });
};

// Update homepage balls (admin panel)
exports.updateBalls = async (req, res) => {
  const { free, premium } = req.body;
  await LottoBall.updateOne({ type: "free", date: { $gte: startOfToday() } }, { balls: free });
  await LottoBall.updateOne({ type: "lunchtime", date: { $gte: startOfToday() } }, { balls: premium.lunchtime });
  await LottoBall.updateOne({ type: "teatime", date: { $gte: startOfToday() } }, { balls: premium.teatime });
  res.json({ message: "Balls updated" });
};

// Get past-winning records
exports.getPastWinning = (_, res) =>  // <-- ADDED THIS FUNCTION
  PastWinning.find().then(records => res.json(records));

// Create new past-winning records
exports.updatePastWinning = async (req, res) => {
  try {
    await Promise.all(req.body.records.map(r =>
      PastWinning.create({ type: r.type, balls: r.balls, date: new Date() })
    ));
    res.json({ message: "Past-winning updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get past-results records
exports.getPastResults = (_, res) =>  // <-- ADDED THIS FUNCTION
  Result.find().then(records => res.json(records));

// Create new past-results records
exports.updatePastResults = async (req, res) => {
  try {
    await Promise.all(req.body.records.map(r =>
      Result.create({ type: r.type, balls: r.balls, date: new Date() })
    ));
    res.json({ message: "Past-results updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Notify a user
exports.notifyUser = (req, res) => {
  const { message } = req.body;
  User.findByIdAndUpdate(req.params.id, {
    $push: { notifications: { body: message, date: new Date() } }
  }).then(() => res.json({ message: "Notified" }));
};

// Get custom URLs for a user
exports.getRedirects = (req, res) =>
  User.findById(req.params.id).then(u => res.json(u.customUrls));

// Update custom URLs for a user
exports.updateRedirects = (req, res) =>
  User.findByIdAndUpdate(req.params.id, { customUrls: req.body.customUrls }, { new: true })
      .then(u => res.json(u.customUrls));

// Utility
function startOfToday() {
  const d = new Date();
  d.setUTCHours(0, 0, 2, 0);
  return d;
}
