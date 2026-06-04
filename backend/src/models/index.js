// Central place to import and initialize Sequelize models.
// Example registration pattern:
// const User = require('./user')(sequelize, DataTypes);
// const College = require('./college')(sequelize, DataTypes);

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export { sequelize, DataTypes };
