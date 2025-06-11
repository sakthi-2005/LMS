const { EntitySchema } = require("typeorm");

const LeaveRequest = new EntitySchema({
  name: "LeaveRequest",
  tableName: "leave_requests",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    user_id: {
      name: "user_id",
      type: Number,
      nullable: false,
    },
    leave_type_id: {
      name: "leave_type_id",
      type: Number,
      nullable: false,
    },
    description: {
      type: String,
      nullable: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    steps_completed: {
      type: Number,
      default: 0,
    },
    steps_required: {
      type: Number,
      default: 1,
    },
    rejection_reason: {
      type: String,
      nullable: true,
    },
    created_at: {
      type: Date,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: Date,
      nullable: true,
    },
    approved_by: {
      type: Number,
      nullable: true,
    },
    rejected_by: {
      type: Number,
      nullable: true,
    },
    current_waiting: {
      type: Number,
      nullable: true,
    },
    no_of_days: {
      type: Number,
      nullable: false,
    },
    from_date: {
      type: Date,
      nullable: false,
    },
    to_date: {
      type: Date,
      nullable: false,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      inverseSide: "leaveRequests",
    },
    leaveType: {
      type: "many-to-one",
      target: "LeaveType",
      joinColumn: {
        name: "leave_type_id",
      },
      inverseSide: "leaveRequests",
    },
    approver: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "approved_by",
      },
      inverseSide: "leaveApprovals",
    },
    rejector: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "rejected_by",
      },
      inverseSide: "leaveRejections",
    },
    currentApprover: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "current_waiting",
      },
      inverseSide: "leaveCurrentApprovals",
    },
    requestHistory: {
      type: "one-to-many",
      target: "RequestHistory",
      inverseSide: "request",
    },
  },
});

module.exports = { LeaveRequest };
