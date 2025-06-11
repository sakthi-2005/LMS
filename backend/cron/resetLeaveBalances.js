const cron = require("node-cron");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const { LeaveBalanceRepo, LeaveTypeRepo , initializeDatabase } = require("../config/db");


cron.schedule("0 0 1 * *", async () => {

  await initializeDatabase();

  try {
    const leaveTypes = await LeaveTypeRepo.find({
      select: ["id", "monthly_allocation"],
    });

    for (const type of leaveTypes) {
      await LeaveBalanceRepo.createQueryBuilder()
        .update()
        .set({ balance: type.monthly_allocation })
        .where("leave_type_id = :id", { id: type.id })
        .execute();
    }
    console.log("Leave balances reset successfully");
  } catch (err) {
    console.error("Error resetting leave balances:", err);
  }
});
