'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const places = [
  {
    ownerId: 1,
    address: "456 Elm Street",
    city: "Los Angeles",
    state: "California",
    country: "United States of America",
    lat: 34.0522,
    lng: -118.2437,
    name: "Coding Dojo",
    description: "Coding bootcamp for beginners",
    price: 200,
  },
  {
    ownerId: 2,
    address: "789 Maple Drive",
    city: "New York",
    state: "New York",
    country: "United States of America",
    lat: 40.7128,
    lng: -74.0060,
    name: "Flatiron School",
    description: "Coding school for career changers",
    price: 150,
  },
  {
    ownerId: 3,
    address: "2468 Oak Avenue",
    city: "Chicago",
    state: "Illinois",
    country: "United States of America",
    lat: 41.8781,
    lng: -87.6298,
    name: "Fullstack Academy",
    description: "Web development bootcamp",
    price: 175,
  }
]



module.exports = {
  async up (queryInterface, Sequelize)  {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, places );
  },

   async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkDelete(options, places)
  }
};
