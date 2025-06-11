const express = require("express");
const { LeaveRequestRepo } = require("../config/db");
const router = express.Router();

router.get("/history", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rawData = await LeaveRequestRepo.createQueryBuilder("lr")
      .leftJoinAndSelect("lr.approver", "approver")
      .leftJoinAndSelect("lr.rejector", "rejector")
      .innerJoinAndSelect("lr.leaveType", "lt")
      .where("lr.user_id = :userId", { userId })
      .select([
        "lr",
        "approver.name AS approver",
        "rejector.name AS rejector",
        "lt.name AS leaveType",
      ])
      .getRawMany();

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("lr_") ? key.slice(3) : key] = row[key];
      }
      return result;
    });


    res.json({ history: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
