const { EntitySchema } = require("typeorm");

const LeaveType = new EntitySchema({
  name: "LeaveType",
  tableName: "leave_types",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    position_id: {
      type: Number,
      nullable: true,
    },
    monthly_allocation: {
      type: Number,
      default: 0,
    },
    conformation_steps: {
      type: Number,
    },
    isDeleted: {
      type : Date,
      nullable: true,
      deleteDate: true,
    }
  },
  relations: {
    leaveRequests: {
      type: "one-to-many",
      target: "LeaveRequest",
      inverseSide: "leaveType",
    },
    leaveBalances: {
      type: "one-to-many",
      target: "LeaveBalance",
      inverseSide: "leaveType",
    },
    position: {
      type: "many-to-one",
      target: "Position",
      joinColumn: {
        name: "position_id",
      },
      inverseSide: "leaveTypes",
    },
  },
  deleteDate: 'isDeleted',
});

module.exports = { LeaveType };
