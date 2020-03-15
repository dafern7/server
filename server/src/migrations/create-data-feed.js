'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DataFeed', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      powerIn: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      powerOut: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      voltage: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      SOC: {
        allowNull: false,
        type: Sequelize.INTEGER
      },      
      current: {
        type: Sequelize.INTEGER
      },
      marketPrice: {
        type: Sequelize.FLOAT
      },
      reactivePower: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DataFeed');
  }
};