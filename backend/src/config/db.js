import { Sequelize } from "sequelize";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://user:pass@localhost:5432/uncommon_dev";

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
});
