const { Sequelize } = require('sequelize');

const User = require('./user');
const College = require('./college');
const Application = require('./application');

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

College.hasMany(Application, {foreignKey: "collegeId"});
Application.belongsTo(College, {foreignKey: "collegeId"});

const models = { User, College, Application };

module.exports = models;