const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  email:         { type: String, required: true },
  whatsapp:      { type: String, required: true },
  occupation:    { type: String, required: true },
  age:           { type: Number, required: true },
  country:       { type: String, required: true },
  maritalStatus: { type: String, enum: ["male","female"], required: true },
  username:      { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true },

  // per-user premium predictions
  premium: {
    lunchtime: { type: [String], default: ["00","00","00","00"] },
    teatime:   { type: [String], default: ["00","00","00","00"] },
  },

  notifications: [{ body: String, date: Date }],
  customUrls:   [{
    url:    String,
    status: { type: String, enum: ["approved","disapproved","pending"], default: "pending" }
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
