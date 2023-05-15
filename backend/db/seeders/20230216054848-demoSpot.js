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
  },
  {
    ownerId: 1,
    address: "111 Park Place",
    city: "Dallas",
    state: "Texas",
    country: "United States of America",
    lat: 32.7767,
    lng: -96.7970,
    name: "Tech Talent South",
    description: "Tech Talent South is a coding bootcamp aiming to foster talent in technology throughout the U.S.",
    price: 220
},
{
  ownerId: 2,
  address: "123 Cherry Lane",
  city: "Austin",
  state: "Texas",
  country: "United States of America",
  lat: 30.2672,
  lng: -97.7431,
  name:' Cozy Austin Home',
  description: 'Perfect for a relaxed, peaceful vacation',
  price: 120,
},
{
  ownerId: 3,
  address: "456 Pine Street",
  city: "Denver",
  state: "Colorado",
  country: "United States of America",
  lat: 39.7392,
  lng: -104.9903,
  name: 'Mountain View Denver House',
  description: 'Enjoy stunning mountain views in this beautiful home',
  price: 200,
},
{
  ownerId: 1,
  address: "789 Birch Drive",
  city: "Seattle",
  state: "Washington",
  country: "United States of America",
  lat: 47.6062,
  lng: -122.3321,
  name: 'Seattle Rain City House',
  description: 'Stay warm and cozy in this delightful Seattle home',
  price: 180,
},
{
  ownerId: 2,
  address: "321 Redwood Avenue",
  city: "San Francisco",
  state: "California",
  country: "United States of America",
  lat: 37.7749,
  lng: -122.4194,
  name: 'SF Golden Gate Home',
  description: 'A charming home near the Golden Gate Bridge',
  price: 250,
},
{
  ownerId: 3,
  address: "654 Cedar Boulevard",
  city: "Portland",
  state: "Oregon",
  country: "United States of America",
  lat: 45.5051,
  lng: -122.6750,
  name: 'Portland Rose House',
  description: 'Feel at home in the City of Roses',
  price: 140,
},
{
  ownerId: 1,
  address: "987 Spruce Way",
  city: "Salt Lake City",
  state: "Utah",
  country: "United States of America",
  lat: 40.7608,
  lng: -111.8910,
  name: 'Salt Lake City Comfort Home',
  description: 'A comfy retreat in the heart of Salt Lake City',
  price: 130,
},
{
  ownerId: 2,
  address: "123 Oak Street",
  city: "Phoenix",
  state: "Arizona",
  country: "United States of America",
  lat: 33.4484,
  lng: -112.0740,
  name: 'Phoenix Sun House',
  description: 'Soak up the sun in this lovely Phoenix home',
  price: 150,
},
{
  ownerId: 3,
  address: "456 Willow Drive",
  city: "Las Vegas",
  state: "Nevada",
  country: "United States of America",
  lat: 36.1699,
  lng: -115.1398,
  name: 'Vegas Villa',
  description: 'Relax and recharge in this delightful Vegas home',
  price: 220,
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
