"use strict";
const userData = [
  {
    id: 1,
    name: "robert",
    email: "robert123@gmail.com",
    password: "something",
    createdAt: "2008-7-04",
    updatedAt: "2008-7-04",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", userData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null);
  },
};
