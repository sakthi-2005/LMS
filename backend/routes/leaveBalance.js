const express = require("express");
const { LeaveBalanceRepo } = require("../config/db");
const router = express.Router();

router.get("/leave-balance", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rows = await LeaveBalanceRepo.createQueryBuilder("lb")
      .innerJoin("leave_types", "lt", "lb.leave_type_id = lt.id")
      .select([
        "lt.name AS leaveType",
        "lb.balance AS remainingLeaves",
        "lb.leave_taken AS leavesTaken",
      ])
      .where("lb.user_id = :userId", { userId })
      .getRawMany();

    res.json({ leaveBalances: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch leave balance" });
  }
});

module.exports = router;
