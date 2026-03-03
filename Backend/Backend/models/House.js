const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("House", houseSchema);