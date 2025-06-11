const express = require("express");
const { LeaveRequestRepo, RequestHistoryRepo } = require("../config/db");
const router = express.Router();

router.patch("/reject-request", async (req, res) => {
  const { userId, reqId, reason } = req.body;

  if (!userId) return res.status(400).json({ error: "Missing userId" });
  if (!reason) return res.status(400).json({ error: "Missing reason" });
  if (!reqId) return res.status(400).json({ error: "Missing requestId" });

  try {
    let leaveRequest = await LeaveRequestRepo.findOne({
      where: { id: reqId },
    });
    if (!leaveRequest) throw new Error("Leave request not found");

    let requestHistory = await RequestHistoryRepo.findOne({
      where: {
        request: { id: reqId },
        manager: { id: leaveRequest.current_waiting },
      },
    });
    requestHistory.status = "rejected";
    await RequestHistoryRepo.save(requestHistory);

    leaveRequest.status = "rejected";
    leaveRequest.current_waiting = null;
    leaveRequest.rejection_reason = reason;
    leaveRequest.rejected_by = userId.id;
    leaveRequest.updated_at = new Date();
    await LeaveRequestRepo.save(leaveRequest);

    res.json({ status: "updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to reject request" });
  }
});

module.exports = router;
