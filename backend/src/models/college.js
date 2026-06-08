const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/db');

module.exports = (sequelize) => {
  class College extends Model {
    static associate(models) {
      College.hasMany(models.Application, {
        foreignKey: 'collegeId',
        as: 'applications',
      });
    }
  }

  College.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Abbreviation or alias, e.g. "MIT"',
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'College',
      tableName: 'Colleges',
      timestamps: true, // createdAt, updatedAt
    }
  );

  return College;
};