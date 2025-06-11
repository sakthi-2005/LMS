const express = require("express");
const router = express.Router();
const {
  UserRepo,
  LeaveTypeRepo,
  LeaveRequestRepo,
  RequestHistoryRepo,
} = require("../config/db");

// Get leave balance for a user
router.post("/request", async (req, res) => {
  let type = req.body.type;
  let b = await getuserDetails(req.body.userId);
  let a = await getstepsRequired(type, b.role_id);

  try {
    let id = await LeaveRequestRepo.createQueryBuilder("lr")
      .select("MAX(lr.id) + 1", "next_id")
      .getRawOne();

    console.log(a, b);

    const request = await LeaveRequestRepo.save({
      id: id.next_id || 1,
      user_id: req.body.userId,
      leave_type_id: a.id,
      from_date: req.body.from,
      to_date: req.body.to,
      description: req.body.reason,
      steps_required: a.conformation_steps,
      current_waiting: b.reporting_manager_id,
      no_of_days: req.body.noOfDays,
    });

    let history_id = await RequestHistoryRepo.createQueryBuilder("lr")
      .select("MAX(lr.id) + 1", "next_id")
      .getRawOne();

    await RequestHistoryRepo.save({
      id: history_id.next_id || 1,
      request_id: request.id,
      user_id: req.body.userId,
      manager_id: b.reporting_manager_id,
      status: "Pending",
      stage: 1,
    });

    res.json({ status: "updated" });
  } catch (err) {
    console.log(err);
    res.json({ status: "Failed requesting" });
  }
});

module.exports = router;

async function getstepsRequired(type, position_id) {
  try {
    const rows = await LeaveTypeRepo.findOne({
      select: ["conformation_steps", "id"],
      where: { position_id: position_id, name: type },
    });

    return rows;
  } catch (err) {
    console.log(err);
  }
}

async function getuserDetails(id) {
  try {
    const rows = await UserRepo.findOne({
      select: ["reporting_manager_id", "role_id"],
      where: { id: id },
    });

    // const [rows] = await db.query(`select reporting_manager_id,role_id from users where id=?`,[id]);
    return rows;
  } catch (err) {
    console.log(err);
  }
}
