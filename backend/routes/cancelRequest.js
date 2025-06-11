const express = require("express");
const router = express.Router();
const { LeaveBalanceRepo, LeaveRequestRepo , HolidaysRepo } = require("../config/db");

router.delete("/deleteRequest", async (req, res) => {
  const lrId = req.query.lrId;
  if (!lrId) return res.status(400).json({ error: "Missing lrId" });

  try {
    const leaveRequest = await LeaveRequestRepo.findOne({
      where: { id: lrId },
      relations: ["user", "leaveType"],
    });

    if (!leaveRequest) {
      throw new Error("Leave request not found");
    }



    if (leaveRequest.status === "approved") {
      let leave_used = 0;
      if(leaveRequest.from_date < new Date()) {
        if(leaveRequest.to_date < new Date()) {
          throw new Error("Cannot cancel leave request that has already completed");
        }
        else{
          let holidays = await HolidaysRepo.find();
          let count = 0;
          for (let d = new Date(); d <= new Date(leaveRequest.to_date); d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            const isoDate = d.toISOString().split("T")[0];
            if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) {
              count++;
            }
          }
          leave_used = count;
        }
      }
      await LeaveBalanceRepo.createQueryBuilder()
        .update("leave_balances")
        .set({
          balance: () => `balance + ${leaveRequest.no_of_days - leave_used}`,
          leave_taken: () => `leave_taken - ${leaveRequest.no_of_days - leave_used}`,
        })
        .where("user_id = :userId", { userId: leaveRequest.user.id })
        .andWhere("leave_type_id = :leaveTypeId", {
          leaveTypeId: leaveRequest.leaveType.id,
        })
        .execute();
    }

    await LeaveRequestRepo.createQueryBuilder()
      .update()
      .set({ status: "cancelled" })
      .where("id = :id", { id: lrId })
      .execute();

    res.json({ status: "deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
