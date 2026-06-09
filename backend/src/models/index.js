import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { College } from "./College.js";

User.hasMany(College, { foreignKey: "userId" });
College.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, College };
