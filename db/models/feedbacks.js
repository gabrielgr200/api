'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedbacks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.cadastro, { foreignKey: 'userId' });
    }
  }
  feedbacks.init({
    feedback: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'feedbacks',
  });
  return feedbacks;
};