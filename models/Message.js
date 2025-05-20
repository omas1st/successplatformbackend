const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body:    { type: String, required: true },
  date:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
