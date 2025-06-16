const express = require("express");
const router = express.Router();
const { UserRepo , RequestHistoryRepo , LeaveRequestRepo , LeaveBalanceRepo } = require("../config/db");

router.delete("/deleteUser", async (req, res) => {
  const userId = req.query.Id;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    await RequestHistoryRepo.softDelete({user_id: Number(userId)});
    await LeaveRequestRepo.softDelete({user_id: Number(userId)});
    await LeaveBalanceRepo.softDelete({user_id: Number(userId)});
    await UserRepo.softDelete({id: Number(userId)});

    res.json({ status: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
