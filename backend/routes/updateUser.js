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

    await UserRepo.save({
      id: userId.id,
      name: userId.name,
      email: userId.email,
      password: userId.password,
      reporting_manager_id: userId.ManagerId || null,
      role_id: position.id,
      isAdmin: userId.isAdmin,
    });

    await LeaveBalanceRepo;
    // let id;
    // const [ID] = await db.query(`select id from positions where name = ?`,[userId.position])
    // if(ID.length == 0){
    //   id = null;
    // }
    // else{
    //   id = ID[0].id
    // }
    // const [rows] = await db.query(` UPDATE users
    //                                       SET
    //                                         name = COALESCE(? , name),
    //                                         email = COALESCE(? , email),
    //                                         password = COALESCE(? , password),
    //                                         reporting_manager_id = COALESCE(? , reporting_manager_id),
    //                                         role_id = COALESCE(? , role_id),
    //                                         isAdmin = COALESCE(? , isAdmin)
    //                                       WHERE
    //                                           id = ?; `,[userId.name,userId.email,userId.password,userId.ManagerId,id,userId.isAdmin,userId.id]);

    res.json({ ststus: "updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

module.exports = router;
