const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const { Worker } = require("bullmq");
const {
  UserRepo,
  PositionRepo,
  LeaveBalanceRepo,
  LeaveTypeRepo,
  initializeDatabase,
} = require("../config/db");

new Worker(
  "addUser",
  async (job) => {
    await initializeDatabase();
    const { users } = job.data;

    for (const user of users) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        const position = await PositionRepo.findOneBy({ name: user.position });

        if (!position) throw new Error("Position not found");

        const latest = await UserRepo.createQueryBuilder("u")
          .select("MAX(u.id)", "max")
          .getRawOne();

        const newUser = UserRepo.create({
          id: latest.max + 1,
          name: user.name,
          email: user.email,
          password: user.password,
          role_id: position.id,
          reporting_manager_id: Number(user.ManagerId) || null,
          isAdmin: Boolean(user.isAdmin),
        });

        await UserRepo.save(newUser);

        let leaveTypes = await LeaveTypeRepo.find({
          where: { position_id: position.id },
        });

        const l_latest = await LeaveBalanceRepo.createQueryBuilder("lb")
          .select("MAX(lb.id)", "max")
          .getRawOne();

        for (const leaveType of leaveTypes) {
          l_latest.max = (l_latest.max || 0) + 1;
          const leaveBalance = LeaveBalanceRepo.create({
            id: l_latest.max,
            user_id: newUser.id,
            leave_type_id: leaveType.id,
            balance: leaveType.monthly_allocation,
            leave_taken: 0,
          });
          await LeaveBalanceRepo.save(leaveBalance);
        }
        console.log(`User ${user.name} added successfully.`);

      } catch (err) {
        console.error("Insert failed:", err.message);
      }
    }
  },
  { connection: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD, maxRetriesPerRequest: null } }
);
