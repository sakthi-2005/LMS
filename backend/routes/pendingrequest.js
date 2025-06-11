const express = require("express");
const router = express.Router();
const { LeaveRequestRepo } = require("../config/db");

router.get("/pendingrequest", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rows = await LeaveRequestRepo.createQueryBuilder("lr")
      .innerJoin("users", "u", "u.id = lr.user_id")
      .innerJoin("leave_types", "lt", "lt.id = lr.leave_type_id")
      .select(["lr.*", "u.name AS user_name", "lt.name AS type"])
      .where("lr.current_waiting = :userId", { userId })
      .getRawMany();

    res.json({ leaveRequestes: rows });
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: "Failed to fetch leave request" });
  }
});

module.exports = router;
