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
      url: 'https://cdn.onekindesign.com/wp-content/uploads/2019/10/Traditional-English-Manor-House-Jauregui-Architect-01-1-Kindesign.jpg',
    },
    {
      spotId: 4,
      preview: true,
      url: 'https://images.unsplash.com/photo-1494526585095-c41746248156',
    },
    {
      spotId: 5,
      preview: true,
      url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
    },
    {
      spotId: 6,
      preview: true,
      url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
    },
    {
      spotId: 7,
      preview: true,
      url: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae',
    },
    {
      spotId: 8,
      preview: true,
      url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    },
    {
      spotId: 9,
      preview: true,
      url: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89',
    },
    {
      spotId: 10,
      preview: true,
      url: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5',
    },
    {
      spotId: 11,
      preview: true,
      url: 'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg',
    },
    {
      spotId: 12,
      preview: true,
      url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e',
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
