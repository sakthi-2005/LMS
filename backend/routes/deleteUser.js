const express = require("express");
const router = express.Router();
const { UserRepo } = require("../config/db");

router.delete("/deleteUser", async (req, res) => {
  const userId = req.query.Id;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    await UserRepo.delete({ id: Number(userId) });
    // await db.query(`DELETE FROM users WHERE id = ?`,[userId]);

    res.json({ status: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
