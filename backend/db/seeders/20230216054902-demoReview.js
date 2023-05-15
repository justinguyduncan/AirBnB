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
      },
      {
        userId: 1,
        spotId: 2,
        review: 'A stunning location with a comfortable interior.',
        stars: 5
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Really loved the atmosphere and the view.',
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: 'A little noisy at night but otherwise great.',
        stars: 4
      },
      {
        userId: 1,
        spotId: 4,
        review: 'The place was a bit small but the location was amazing.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 5,
        review: 'The most luxurious spot I have ever stayed in!',
        stars: 5
      },
      {
        userId: 3,
        spotId: 6,
        review: 'Very comfortable and well-maintained.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 7,
        review: 'Nice spot but the neighbors were a bit loud.',
        stars: 3
      },
      {
        userId: 2,
        spotId: 8,
        review: 'A perfect spot for a weekend getaway.',
        stars: 4
      },
      {
        userId: 3,
        spotId: 9,
        review: 'The spot was not as clean as I expected.',
        stars: 2
      },
      {
        userId: 1,
        spotId: 10,
        review: 'An amazing spot with a breathtaking view.',
        stars: 5
      },
      {
        userId: 2,
        spotId: 11,
        review: 'The place was cozy and comfortable. Loved it!',
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: 'A wonderful location. Will definitely visit again.',
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Not quite what I was expecting. The pictures were a bit misleading.',
        stars: 2
      },
      {
        userId: 2,
        spotId: 1,
        review: 'An incredible place. I loved every minute of my stay!',
        stars: 5
      },
      {
        userId: 3,
        spotId: 4,
        review: 'Clean, cozy, and charming. Highly recommended.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: 'Great location, but a bit overpriced for what it is.',
        stars: 3
      },
      {
        userId: 2,
        spotId: 6,
        review: 'An exceptional spot with top-notch facilities.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 7,
        review: 'The spot was a bit noisy. Might not be ideal for light sleepers.',
        stars: 3
      },
      {
        userId: 1,
        spotId: 8,
        review: 'Loved the interior decor. Felt right at home.',
        stars: 4
      },
      {
        userId: 2,
        spotId: 9,
        review: 'Good spot but could use a bit more maintenance.',
        stars: 3
      },
      {
        userId: 3,
        spotId: 10,
        review: 'Amazing views and a very comfortable stay.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 11,
        review: 'The spot was decent but lacked a few amenities.',
        stars: 3
      }


    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'
    return queryInterface.bulkDelete(options, null, {})
  }
};
