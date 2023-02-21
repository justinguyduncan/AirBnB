const express = require('express');
const { setTokenCookie, requireAuth, Booking } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');


const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { response } = require('express');

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .withMessage({message: 'Street address is required'}),
    check('city')
        .exists({checkFalsy: true})
        .withMessage({message: 'City is required'}),
    check('state')
        .exists({checkFalsy: true})
        .withMessage({message: 'State is required'}),
    check('country')
        .exists({checkFalsy: true})
        .withMessage({message: 'Country is required'}),
    check('lat')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage({message: 'Latitude is not valid'}),
    check('lng')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage({message: 'Longitude is not valid'}),
    check('name')
        .exists({checkFalsy: true})
        .isString()
        .withMessage({message: 'Name must be less than 50 characters'}),
    check('description')
        .exists({checkFalsy: true})
        .isString()
        .withMessage({message: 'Description is required'}),
    check('price')
        .exists({checkFalsy: true})
        .isNumeric()
        .withMessage({message: 'Price per day is required'}),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .isString()
        .withMessage({message: 'Review text is required'}),
     check('stars')
        .exists({checkFalsy: true})
        .isDecimal()
        .withMessage({message: 'Stars must be an integer from 1 to 5'}),
    handleValidationErrors
]

//Get All Spots
// Define a route for getting all spots.
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: SpotImage,
          attributes: ['url']
        },
        {
          model: Review,
          attributes: []
        }
      ],
      group: ['Spot.id']
    });

    const result = spots.map((spot) => {
      const previewImage = spot.SpotImages[0];
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.dataValues.avgRating,
        previewImage: previewImage ? previewImage.url : null
      };
    });

    return res.json(result);
  });

//Create a new spot
router.post('/', validateSpot, handleValidationErrors, async (req, res) => {

    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const spot = await Spot.create({ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price});

    return res.json(spot);

});

//Add an Image to Spot based on the Spot Id
router.post('/:spotId/images', async(req, res) =>{

    const currentSpot = await Spot.findByPk(req.params.spotId);

    if(!currentSpot) {
        res.status(404);
        return res.json({message: "Spot couldn't be found", statusCode: 404});
    }

        const { url, preview} = req.body;

        const spotId = parseInt (req.params.spotId, 10);

        const image = await SpotImage.create({
            spotId,
            preview,
            url,
        })

        const result = {
            id: image.id,
            url: image.url,
            preview: image.preview
        };
        return res.status(201).json(result)
});





//Get All Spots Owned by Current User
router.get('/current', async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId: userId },
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
      ],
      include: [
        {
          model: SpotImage,
          attributes: ['url']
        },
        {
          model: Review,
          attributes: []
        }
      ],
      group: ['Spot.id']
    });

    const result = spots.map((spot) => {
      const previewImage = spot.SpotImages[0];
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.dataValues.avgRating,
        previewImage: previewImage ? previewImage.url : null
      };
    });

    return res.json(result);
  });

  //Get details for a Spot from an id
  router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: Review,
          attributes: [[Sequelize.fn('COUNT', Sequelize.col('*')), 'numReviews'], [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],
        },
      ],
      group: ['Spot.id', 'User.id', 'SpotImages.id']
    });

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found.', statusCode : 404 });
    }

    res.json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.Reviews[0].dataValues.numReviews,
      avgRating: spot.Reviews[0].dataValues.avgRating,
      SpotImages: spot.SpotImages,
      Owner: spot.User
    });
  });



//Edit a Spot
router.put('/:spotId', validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const updateSpot = await Spot.findByPk(req.params.spotId);

  if (!updateSpot) {
    return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 });
  }

  const updatedFields = { address, city, state, country, lat, lng, name, description, price };

  Object.keys(updatedFields).forEach(key => {
    if (updatedFields[key]) {
      updateSpot[key] = updatedFields[key];
    }
  });

  await updateSpot.save();

  return res.json({ updateSpot });
});

//Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

  const deleteSpot = await Spot.findByPk(req.params.spotId);

  if(deleteSpot){
    await deleteSpot.destroy();
    res.status(200).json({message: "Successfully deleted", statusCode: 200})
  }else{
    res.status(404).json({message: "Spot couldn't be found", statusCode: 404})
  }

})



//Create a Review For a Spot based on spotId
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;

    // Check if the spot exists
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      });
    }

    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId: req.params.spotId
      }
    });
    if (existingReview) {
      return res.status(403).json({
        message: 'User already has a review for this spot',
        statusCode: 403
      });
    }

    // Create the new review
    const newReview = await Review.create({
      review,
      stars,
      userId: req.user.id,
      spotId: req.params.spotId
    });

    // Get the created review data including createdAt and updatedAt
    const createdReview = await Review.findByPk(newReview.id, {
      attributes: [
        'id',
        'userId',
        'spotId',
        'review',
        'stars',
        'createdAt',
        'updatedAt'
      ]
    });

    return res.json(createdReview);
});


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;

  const findSpot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url'],
          },
        ],
      },
    ],
  });

  if (!findSpot) {
    return res.status(404).json({ message: 'Spot not found', statusCode: 404 });
  }

  const reviews = findSpot.Reviews;

  return res.json(reviews);
});

// //Create Booking from Spot based on SpotId
// router.post('/:spotId/bookings', requireAuth, async (req, res) => {
//     const spot = await Spot.findByPk(req.params.spotId);
//     const user = req.user;
//     const { startDate, endDate } = req.body;

//     if (!spot) {
//       return res.status(404).json({
//         message: 'Spot not found',
//         statusCode: 404
//       });
//     }

//     if (user.id === spot.ownerId) {
//       return res.status(403).json({
//         message: 'You cannot book your own spot',
//         statusCode: 403
//       });
//     }

//     const existingBooking = await Booking.findOne({
//       where: {
//         spotId: spot.id,
//         [Op.or]: [
//           {
//             startDate: {
//               [Op.between]: [startDate, endDate],
//             },
//           },
//           {
//             endDate: {
//               [Op.between]: [startDate, endDate],
//             },
//           },
//           {
//             startDate: {
//               [Op.lte]: startDate,
//             },
//             endDate: {
//               [Op.gte]: endDate,
//             },
//           },
//         ],
//       },
//     });

//     if (existingBooking) {
//       return res.status(403).json({
//         message: 'Booking already exists for specified dates',
//         statusCode: 403,
//       });
//     }

//     const booking = await Booking.create({
//       userId: user.id,
//       spotId: spot.id,
//       startDate,
//       endDate,
//     });

//     const resObj = {
//       id: booking.id,
//       userId: booking.userId,
//       spotId: booking.spotId,
//       startDate: booking.startDate,
//       endDate: booking.endDate,
//       createdAt: booking.createdAt,
//       updatedAt: booking.updatedAt,
//     };

//     return res.status(200).json(resObj);


// });

module.exports = router;
