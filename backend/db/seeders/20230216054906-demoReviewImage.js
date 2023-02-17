'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'ReviewImages';
   await queryInterface.bulkInsert(options, [
    {
      url: 'https://media.istockphoto.com/id/1292475721/photo/house-construction-framing-gradating-into-finished-kitchen-build.jpg?s=612x612&w=0&k=20&c=Bej7Uvae4UaukW4kNYlAV9CkjP7-JTYfTNuCpB49x88=',
      reviewId: 1
    },
    {
      url: 'https://media.istockphoto.com/id/1326191354/photo/green-sofa-in-modern-apartment-interior-with-empty-wall-and-wooden-table.jpg?s=612x612&w=0&k=20&c=dtGbXtdEGK1xlblrDuLrx9RoCG_fpVBsDGO0hIbmXkY=',
      reviewId: 2
    },
    {
      url: 'https://media.istockphoto.com/id/1282723854/photo/empty-classroom-during-covid-19-pandemic.jpg?s=612x612&w=0&k=20&c=MqcApFHkroAutt9yDJuMJrU6Iop4DEYGso_qTs5-WpI=',
      reviewId: 3
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.bulkDelete(options)
  }
};
