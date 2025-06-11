const express = require("express");
const { UserRepo } = require("../config/db");
const router = express.Router();

router.get("/allUsers", async (req, res) => {
  try {
    //const [rows] = await db.query(`select u.* , p.name as position from users u JOIN positions p ON u.role_id = p.id ORDER BY u.id ASC`);

    const rawData = await UserRepo.createQueryBuilder("u")
      .innerJoin("u.position", "p")
      .addSelect("p.name", "position")
      .orderBy("u.id", "ASC")
      .getRawMany();

    const rows = rawData.map((row) => {
      const result = {};
      for (const key in row) {
        result[key.startsWith("u_") ? key.slice(2) : key] = row[key];
      }
      return result;
    });

    res.json({ users: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

module.exports = router;
