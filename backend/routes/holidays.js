const express = require("express");
const router = express.Router();
const { HolidaysRepo } = require("../config/db");

router.get("/holiday", async (req, res) => {
  try {
    const rows = await HolidaysRepo.find();

    res.json({ holidays: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch holidays" });
  }
});

module.exports = router;
