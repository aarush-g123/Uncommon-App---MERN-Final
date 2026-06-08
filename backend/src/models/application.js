const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/db');

module.exports = (sequelize) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'applicant',
      });
      Application.belongsTo(models.College, {
        foreignKey: 'collegeId',
        as: 'college',
      });
    }
  }

  Application.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      collegeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Colleges',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('not_started', 'applied', 'accepted', 'rejected', 'EA', 'RD', 'ED'),
        defaultValue: 'not_started',
        allowNull: false,
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      decisionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      term: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Intended enrollment term, e.g. "Fall 2026"',
      },
      programOfStudy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Application',
      tableName: 'Applications',
      timestamps: true, // createdAt, updatedAt
      indexes: [
        {
          unique: true,
          fields: ['userId', 'collegeId'],
          name: 'unique_user_college_application',
        },
      ],
    }
  );

  return Application;
};