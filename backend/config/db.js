const { DataSource } = require("typeorm");
require("dotenv").config();
const { User } = require("../entities/User");
const { LeaveType } = require("../entities/LeaveType");
const { LeaveBalance } = require("../entities/LeaveBalance");
const { LeaveRequest } = require("../entities/LeaveRequest");
const { Holidays } = require("../entities/Holidays");
const { Position } = require("../entities/Positions");
const { RequestHistory } = require("../entities/RequestHistory");


const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    User,
    LeaveType,
    LeaveBalance,
    LeaveRequest,
    Holidays,
    Position,
    RequestHistory,
  ],
  migrations: ["src/migrations/**/*.ts"],
});


const initializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      console.log("Database connection already initialized");
      return;
    }
    await AppDataSource.initialize();
    console.log("Database connection successfully established");
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
  }
};

const UserRepo = AppDataSource.getRepository(User);
const LeaveTypeRepo = AppDataSource.getRepository(LeaveType);
const LeaveBalanceRepo = AppDataSource.getRepository(LeaveBalance);
const LeaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
const HolidaysRepo = AppDataSource.getRepository(Holidays);
const PositionRepo = AppDataSource.getRepository(Position);
const RequestHistoryRepo = AppDataSource.getRepository(RequestHistory);

module.exports = {
  initializeDatabase,
  UserRepo,
  LeaveTypeRepo,
  LeaveBalanceRepo,
  LeaveRequestRepo,
  HolidaysRepo,
  PositionRepo,
  RequestHistoryRepo,
};
