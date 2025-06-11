const express = require("express");
const router = express.Router();
const {
  UserRepo,
  LeaveRequestRepo,
  LeaveBalanceRepo,
  RequestHistoryRepo,
} = require("../config/db");

router.patch("/accept-request", async (req, res) => {
  const { userId, reqId } = req.body;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const leaveRequest = await LeaveRequestRepo.findOne({
      where: { id: reqId },
    });

    if (!leaveRequest) throw new Error("Leave request not found");

    const currentApprover = await UserRepo.findOne({
      where: { id: leaveRequest.current_waiting },
    });

    if (!currentApprover) throw new Error("Current approver not found");

    console.log(leaveRequest);
    let requestHistory = await RequestHistoryRepo.findOne({
      where: {
        request_id: leaveRequest.id,
        manager_id: leaveRequest.current_waiting,
      },
    });
    requestHistory.status = "approved";
    await RequestHistoryRepo.save(requestHistory);

    const isFinalStep =
      leaveRequest.steps_required === leaveRequest.steps_completed + 1;

    leaveRequest.status = isFinalStep ? "approved" : "pending";
    leaveRequest.current_waiting = isFinalStep
      ? null
      : currentApprover.reporting_manager_id;
    leaveRequest.approved_by = isFinalStep ? userId : null;
    leaveRequest.steps_completed += 1;
    leaveRequest.updated_at = new Date();
    await LeaveRequestRepo.save(leaveRequest);

    if (!isFinalStep) {
      console.log("never entered here");
      let history_id = await RequestHistoryRepo.createQueryBuilder("lr")
        .select("MAX(lr.id) + 1", "next_id")
        .getRawOne();

      await RequestHistoryRepo.save({
        id: history_id.next_id || 1,
        request_id: reqId,
        user_id: leaveRequest.user_id,
        manager_id: currentApprover.reporting_manager_id,
        status: "Pending",
        stage: leaveRequest.steps_completed + 1,
        updated_at: new Date(),
      });

      res.json({ status: "updated" });
      return;
    }

    const leaveBalance = await LeaveBalanceRepo.findOne({
      where: {
        user_id: leaveRequest.user_id,
        leave_type_id: leaveRequest.leave_type_id,
      },
    });

    if (!leaveBalance) throw new Error("Leave balance not found");

    leaveBalance.leave_taken += leaveRequest.no_of_days;
    leaveBalance.balance -= leaveRequest.no_of_days;

    await LeaveBalanceRepo.save(leaveBalance);

    res.json({ status: "updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to acceptRequest" });
  }
});

module.exports = router;
