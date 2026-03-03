const express = require("express");
const House = require("../models/House");
const router = express.Router();

// Add House
router.post("/add", async (req, res) => {
  try {
    const house = new House(req.body);
    await house.save();
    res.status(201).json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Houses
router.get("/", async (req, res) => {
  const houses = await House.find();
  res.json(houses);
});

module.exports = router;