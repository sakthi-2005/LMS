const express = require("express");
const router = express.Router();
const { UserRepo } = require("../config/db");
router.get("/reportees", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const rows = await UserRepo.createQueryBuilder("u")
      .select("u.name", "name")
      .addSelect((subQuery) => {
        return subQuery
          .select("lr.id")
          .from("leave_requests", "lr")
          .where("lr.user_id = u.id")
          .andWhere("lr.status = :status", { status: "approved" })
          .orderBy("lr.id", "DESC")
          .limit(1);
      }, "leave_request_id")
      .addSelect((subQuery) => {
        return subQuery
          .select("lr.from_date")
          .from("leave_requests", "lr")
          .where("lr.user_id = u.id")
          .andWhere("lr.status = :status", { status: "approved" })
          .orderBy("lr.id", "DESC")
          .limit(1);
      }, "from_date")
      .addSelect((subQuery) => {
        return subQuery
          .select("lr.to_date")
          .from("leave_requests", "lr")
          .where("lr.user_id = u.id")
          .andWhere("lr.status = :status", { status: "approved" })
          .orderBy("lr.id", "DESC")
          .limit(1);
      }, "to_date")
      .where("u.reporting_manager_id = :managerId", { managerId: userId })
      .getRawMany();

    //   `SELECT
    //         u.name,
    //         (
    //             SELECT lr.id
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS leave_request_id,
    //         (
    //             SELECT lr.from_date
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS from_date,
    //         (
    //             SELECT lr.to_date
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS to_date
    //     FROM
    //         users u
    //     WHERE
    //         u.reporting_manager_id = ?`,
    //   [userId,userId,userId]
    // );

    res.json({ reportees: rows });
  } catch (err) {
    console.log(err);
    res.status(501).json({ error: "Failed to fetch reportees" });
  }
});

module.exports = router;
