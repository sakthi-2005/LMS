const express = require("express");
const router = express.Router();
const { PositionsRepo } = require("../config/db");

router.patch("/updateLeave", async (req, res) => {
  const { leaveId } = req.body;
  if (!leaveId) return res.status(400).json({ error: "Missing userId" });

  try {
    const position = await PositionsRepo.findOne({
      select: ["id"],
      where: { name: leaveId.position },
    });

    await LeaveTypeRepo.save({
      id: leaveId.id,
      name: leaveId.name,
      monthly_allocation: leaveId.days_allowed,
      conformation_steps: leaveId.conformation_steps,
      position_id: position ? position.id : null,
    });

    res.json({ status: "updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update leave" });
  }
});

module.exports = router;
