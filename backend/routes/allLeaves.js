const express = require("express");
const router = express.Router();
const { LeaveTypeRepo } = require("../config/db");

router.get("/allLeaves", async (req, res) => {
  try {
      let query = await LeaveTypeRepo.createQueryBuilder("lt")
      .innerJoin("lt.position", "p")
      .addSelect("p.name", "position")
      .orderBy("p.id", "DESC");

    if (req.params.pId != undefined) {
      await query.where("lt.position_id = :pId", { pId: req.params.pId });
    }
    let rawData = await query.getRawMany();

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("lt_") ? key.slice(3) : key] = row[key];
      }
      return result;
    });

    res.json({ leaves: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

module.exports = router;
