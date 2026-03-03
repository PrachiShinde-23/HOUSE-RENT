
const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const House = require("../models/House");

// ✅ Correct destructuring
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/book/:houseId", authMiddleware, async (req, res) => {
  try {
    const house = await House.findById(req.params.houseId);

    if (!house || !house.available) {
      return res.status(400).json({ message: "House not available" });
    }

    const booking = new Booking({
      user: req.user.id,
      house: house._id
    });

    house.available = false;

    await booking.save();
    await house.save();

    res.json({ message: "House booked successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;