const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role_id: {
      type: Number,
    },
    reporting_manager_id: {
      type: Number,
      nullable: true,
    },
    isAdmin: {
      type: Boolean,
    },
    isDeleted: {
      type : Date,
      nullable: true,
      deleteDate: true,
    }
  },
  relations: {
    manager: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "reporting_manager_id",
      },
      inverseSide: "directReports",
    },
    directReports: {
      type: "one-to-many",
      target: "User",
      inverseSide: "manager",
    },
    position: {
      type: "many-to-one",
      target: "Position",
      joinColumn: {
        name: "role_id",
      },
      inverseSide: "users",
    },
    leaveRequests: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "user",
    },
    leaveBalances: {
      type: "one-to-many",
      target: "LeaveBalance",
      inverseSide: "user",
    },
    leaveApprovals: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "approver",
    },
    leaveRejections: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "rejector",
    },
    leaveCurrentApprovals: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "currentApprover",
    },
    userHistory: {
      type: "one-to-many",
      target: "RequestHistory",
      inverseSide: "user",
    },
    managerHistory: {
      type: "one-to-many",
      target: "RequestHistory",
      inverseSide: "manager",
    },
  },
  deleteDate: 'isDeleted',
});

module.exports = { User };
