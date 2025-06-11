const express = require("express");
const router = express.Router();
const { LeaveRequestRepo , UserRepo } = require("../config/db");

router.get("/calendarLeaves", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const user  = await UserRepo.findOneBy({ id: userId });

    const rawData = await LeaveRequestRepo.createQueryBuilder("lr")
      .innerJoin("lr.user", "u")
      .innerJoin("lr.leaveType", "lt")
      .addSelect("u.name", "u_name")
      .addSelect("lt.name", "Type")
      .where("(u.reporting_manager_id = :userId OR u.id = :userId OR u.reporting_manager_id = :manager)", { userId , manager: user.reporting_manager_id })
      .andWhere("lr.status = :status", { status: "approved" })
      .getRawMany();

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("lr_") ? key.slice(3) : key] = row[key];
      }
      return result;
    });

    res.json({ leaves: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
});

module.exports = router;
