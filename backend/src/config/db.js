import { Sequelize } from "sequelize";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://appuser:apppassword@localhost:5433/uncommon_dev";

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
});
