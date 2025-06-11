const { EntitySchema } = require("typeorm");

const Holidays = new EntitySchema({
  name: "Holidays",
  tableName: "holidays",
  columns: {
    name: {
      type: String,
      nullable: false,
    },
    date: {
      type: Date,
      nullable: false,
      primary: true,
    },
  },
});

module.exports = { Holidays };
