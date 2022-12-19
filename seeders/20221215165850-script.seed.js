"use strict";

const scriptData = [
  {
    id: 1,
    imageSource: "xyz.com",
    price: 120,
    currencyType: "ethereum",
    userId: 1,
    createdAt: "2008-7-04",
    updatedAt: "2008-7-04",
  },
  {
    id: 2,
    imageSource: "xyz.com",
    price: 88,
    currencyType: "ethereum",
    userId: 1,
    createdAt: "2008-7-04",
    updatedAt: "2008-7-04",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("scripts", scriptData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("scripts", null);
  },
};
