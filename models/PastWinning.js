const mongoose = require("mongoose");

const pastWinningSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ["lunchtime","teatime"], required: true },
  balls: [ String ]
});

module.exports = mongoose.model("PastWinning", pastWinningSchema);
