const LottoBall   = require("../models/LottoBall");
const PastWinning = require("../models/PastWinning");
const Result      = require("../models/Result");

// GET free balls for today
exports.getFree = async (req, res) => {
  try {
    let doc = await LottoBall.findOne({ type: "free", date: { $gte: startOfToday() } });
    if (!doc) {
      doc = await LottoBall.create({
        type: "free",
        balls: Array(14).fill({ value: "00", isWon: false })
      });
    }
    res.json({ balls: doc.balls.map(b => b.value) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET premium predictions for today
exports.getPremium = async (req, res) => {
  try {
    const lt = await upsert("lunchtime", 4);
    const tt = await upsert("teatime",   4);
    res.json({
      lunchtime: lt.balls.map(b => b.value),
      teatime:   tt.balls.map(b => b.value)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET most recent past-winning (4 balls each)
exports.getPastWinning = async (req, res) => {
  try {
    const lt = await PastWinning.findOne({ type: "lunchtime" }).sort({ date: -1 });
    const tt = await PastWinning.findOne({ type: "teatime"   }).sort({ date: -1 });
    res.json({
      lunchtime: lt?.balls.slice(0,4) || Array(4).fill("00"),
      teatime:   tt?.balls.slice(0,4) || Array(4).fill("00")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET most recent past-results (7 balls each)
exports.getPastResults = async (req, res) => {
  try {
    const lt = await Result.findOne({ type: "lunchtime" }).sort({ date: -1 });
    const tt = await Result.findOne({ type: "teatime"   }).sort({ date: -1 });
    res.json({
      lunchtime: lt?.balls.slice(0,7) || Array(7).fill("00"),
      teatime:   tt?.balls.slice(0,7) || Array(7).fill("00")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helpers

async function upsert(type, count) {
  let doc = await LottoBall.findOne({ type, date: { $gte: startOfToday() } });
  if (!doc) {
    doc = await LottoBall.create({
      type,
      balls: Array(count).fill({ value: "00", isWon: false })
    });
  }
  return doc;
}

function startOfToday() {
  const d = new Date();
  d.setUTCHours(0,0,0,0);
  return d;
}
