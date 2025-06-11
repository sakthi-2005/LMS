const { EntitySchema } = require("typeorm");

const LeaveBalance = new EntitySchema({
  name: "LeaveBalance",
  tableName: "leave_balances",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    user_id: {
      type: Number,
      nullable: false,
    },
    leave_type_id: {
      type: Number,
      nullable: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    leave_taken: {
      type: Number,
      default: 0,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      inverseSide: "leaveBalances",
    },
    leaveType: {
      type: "many-to-one",
      target: "LeaveType",
      joinColumn: {
        name: "leave_type_id",
      },
      inverseSide: "leaveBalances",
    },
  },
});

module.exports = { LeaveBalance };
