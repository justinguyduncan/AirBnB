'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-03-05'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate:new Date( '2023-04-15'),
        endDate: new Date('2023-04-20'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023-05-10'),
        endDate: new Date('2023-05-15'),
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
options.tableName = 'Bookings';
await queryInterface.bulkDelete(options)
  }
};
