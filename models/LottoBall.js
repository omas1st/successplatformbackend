// backend/models/LottoBall.js
const mongoose = require("mongoose");

const lottoSchema = new mongoose.Schema({
  // Now allows 'free', 'lunchtime', or 'teatime'
  type: {
    type: String,
    enum: ["free", "lunchtime", "teatime"],
    required: true
  },
  balls: [
    {
      value: String,
      isWon: { type: Boolean, default: false }
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LottoBall", lottoSchema);
