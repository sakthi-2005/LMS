const express = require("express");
const router = express.Router();
const { UserRepo } = require("../config/db");

router.get("/userDetails", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rows = await UserRepo.createQueryBuilder("u")
      .leftJoin("users", "m", "u.reporting_manager_id = m.id")
      .innerJoin("positions", "p", "u.role_id = p.id")
      .select([
        "u.name as name",
        "u.email as email",
        "u.password as password",
        "u.id as id",
        "p.name AS position",
        "m.name AS Manager",
        "m.id AS reporting_manager_id",
      ])
      .where("u.id = :userId", { userId })
      .getRawOne();
    // const [rows] = await db.query(`SELECT u.*,p.name as position,m.name as Manager from users u JOIN users m ON u.reporting_manager_id = m.id JOIN positions p ON u.role_id = p.id WHERE u.id = ?`,[userId]);

    res.json({ userDetails: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

module.exports = router;
