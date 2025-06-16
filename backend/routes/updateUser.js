const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { UserRepo, PositionRepo, LeaveBalanceRepo } = require("../config/db");

router.patch("/updateUser", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const position = await PositionRepo.findOne({
      select: ["id"],
      where: { name: userId.position },
    });

    const hashedPassword = await bcrypt.hash(userId.password, 10);
    userId.password = hashedPassword;

    let updated = {
      id: userId.id,
      name: userId.name,
      email: userId.email,
      reporting_manager_id: userId.ManagerId || null,
      role_id: position.id,
      isAdmin: userId.isAdmin,
    }

    if(userId.password){
      updated.password = hashedPassword;
    }

    await UserRepo.save(updated);

    res.json({ ststus: "updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

module.exports = router;
