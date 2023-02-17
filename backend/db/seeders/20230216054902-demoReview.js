'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'This was an awesome spot!',
        stars: 4
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Great location and amenities.',
        stars: 4
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Could be cleaner, but overall a good experience.',
        stars: 3
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'
    return queryInterface.bulkDelete(options, null, {})
  }
};
