const { EntitySchema } = require("typeorm");

const RequestHistory = new EntitySchema({
  name: "RequestHistory",
  tableName: "request_history",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    status: {
      type: String,
      length: 50,
    },
    stage: {
      type: Number,
    },
    user_id: {
      type: Number,
      nullable: false,
    },
    request_id: {
      type: Number,
      nullable: false,
    },
    manager_id: {
      type: Number,
      nullable: false,
    },
    created_at: {
      type: Date,
      default: () => "CURRENT_TIMESTAMP",
      createDate: true,
    },
    updated_at: {
      type: Date,
      default: () => "CURRENT_TIMESTAMP",
      updateDate: true,
    },
  },
  relations: {
    request: {
      type: "many-to-one",
      target: "LeaveRequest",
      joinColumn: {
        name: "request_id",
      },
      inverseSide: "requestHistory",
      nullable: false,
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      inverseSide: "userHistory",
      nullable: false,
    },
    manager: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "manager_id",
      },
      inverseSide: "managerHistory",
      nullable: false,
    },
  },
});

module.exports = { RequestHistory };
