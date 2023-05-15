'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'SpotImages';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      preview: true,
      url: 'https://media.istockphoto.com/id/1147674297/photo/single-family-new-construction-home-in-suburb-neighborhood-in-the-south.jpg?s=1024x1024&w=is&k=20&c=AOMfbaq3cT9UI1y6I5qfJ4zz0X5qYiZKBiUtq_phMmI=',
    },
    {
      spotId: 2,
      preview: true,
      url: 'https://media.istockphoto.com/id/524085051/photo/beautiful-exterior-of-new-luxury-home-at-twilight.jpg?s=1024x1024&w=is&k=20&c=cugGNu3UXs_s6k3Sx0q_CHV2RGAtoNZwA_Z4zifQdYE=',
    },
    {
      spotId: 3,
      preview: true,
      url: 'https://media.istockphoto.com/id/1303750117/photo/modern-real-estate-front-exterior-blue-and-white-color-scheme-with-landscaping.jpg?s=1024x1024&w=is&k=20&c=krUQXH4mn7HljWpKSw8dzQ956Gdh3gfpMG2cQooMgD0=',

    },{
      spotId: 4,
      preview: true,
      url: 'https://media.istockphoto.com/photos/luxury-home-exterior-at-sunset-front-yard-picture-id184796502',
    },
    {
      spotId: 5,
      preview: true,
      url: 'https://media.istockphoto.com/photos/new-home-house-exterior-picture-id531171272',
    },
    {
      spotId: 6,
      preview: true,
      url: 'https://media.istockphoto.com/photos/house-exterior-picture-id187221210',
    },
    {
      spotId: 7,
      preview: true,
      url: 'https://media.istockphoto.com/photos/home-exterior-on-sunny-day-with-blue-sky-picture-id184796432',
    },
    {
      spotId: 8,
      preview: true,
      url: 'https://media.istockphoto.com/photos/luxury-home-exterior-with-sky-and-clouds-picture-id177707262',
    },
    {
      spotId: 9,
      preview: true,
      url: 'https://media.istockphoto.com/photos/home-exterior-with-stone-picture-id187221206',
    },
    {
      spotId: 10,
      preview: true,
      url: 'https://media.istockphoto.com/photos/luxury-home-exterior-at-sunset-picture-id506620656',
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
