const express = require('express');
const { setTokenCookie, requireAuth, validateSpotOwner} = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage,  Booking  } = require('../../db/models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');


const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { response } = require('express');

const validateSpot = [
  check('name')
        .exists({checkFalsy: true})
        .isString()
        .isLength({min:1, max: 50})
        .withMessage({message: 'Name is required'}),
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
    // check('lat')
    //     .exists({checkFalsy: true})
    //     .isDecimal()
    //     .withMessage({message: 'Latitude is not valid'}),
    // check('lng')
    //     .exists({checkFalsy: true})
    //     .isDecimal()
    //     .withMessage({message: 'Longitude is not valid'}),
    check('description')
        .exists({checkFalsy: true})
        .isString()
        .isLength({min: 30})
        .withMessage({message: 'Description needs 30 or more characters'}),
        check('price')
        .exists({checkFalsy: true})
        .isNumeric()
        .custom((value, { req }) => {
            if (value <= 0 ) {
                throw new Error('Price is required');
            } else {
                return true;
            }
        }),
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
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // page = Number(page);
  // size = Number(size);

  // Check for invalid query parameters
  // if (Number.isNaN(page) || page <= 0 || Number.isNaN(size) || size <= 0 ||
  //     (minLat && (Number.isNaN(minLat) || minLat < -90 || minLat > 90)) ||
  //     (maxLat && (Number.isNaN(maxLat) || maxLat < -90 || maxLat > 90)) ||
  //     (minLng && (Number.isNaN(minLng) || minLng < -180 || minLng > 180)) ||
  //     (maxLng && (Number.isNaN(maxLng) || maxLng < -180 || maxLng > 180)) ||
  //     (minPrice && (Number.isNaN(minPrice) || minPrice < 0)) ||
  //     (maxPrice && (Number.isNaN(maxPrice) || maxPrice < 0))) {
  //   return res.status(400).json({ message: 'Invalid query parameters', statusCode: 400 });
  // }

  // Set default values for page and size
  // if (!page) page = 1;
  // if (!size) size = 2000;

  const spots = await Spot.findAll({
    where: {
      // lat: {
      //   [Op.gte]: minLat || -90,
      //   [Op.lte]: maxLat || 90,
      // },
      // lng: {
      //   [Op.gte]: minLng || -180,
      //   [Op.lte]: maxLng || 180,
      // },
      // price: {
      //   [Op.gte]: minPrice || 0,
      //   [Op.lte]: maxPrice || 999999,
      // },
    },
    //limit: size,
    // offset: Math.abs(size * (page - 1)),
    attributes: [
      'id',
      'ownerId',
      'address',
      'city',
      'state',
      'country',
      // 'lat',
      // 'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
    ],
  });

  // Get previewImage and average rating for each spot
  for await (let spot of spots) {
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true,
      },
    });

    if (previewImage) {
      spot.dataValues.previewImage = previewImage.url;
    } else {
      spot.dataValues.previewImage = null;
    }

    const rating = await Review.findAll({
      where: {
        spotId: spot.id,
      },
    });

    let sum = 0;

    if (rating.length) {
      rating.forEach((ele) => {
        sum += ele.stars;
      });

      let avg = sum / rating.length;

      spot.dataValues.avgRating = avg;
    } else {
      spot.dataValues.avgRating = null;
    }
  }

  return res.json({ spots });
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
      group: ['Spot.id', 'SpotImages.id']
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
          attributes: ['id', 'userId', 'stars'],
          include: [
            {
              model: Spot,
              as: 'Spot',
              attributes: []
            }
          ]
        }
      ],
      group: ['Spot.id', 'User.id', 'SpotImages.id', 'Reviews.id']
    });

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found.', statusCode: 404 });
    }

    // Calculate numReviews and avgRating
    const numReviews = spot.Reviews.length;
    const avgRating = spot.Reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews;

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
      numReviews: numReviews,
      avgRating: numReviews > 0 ? avgRating : 0,
      SpotImages: spot.SpotImages,
      Owner: spot.User
    });
  });



//Edit a Spot
router.put('/:spotId', validateSpot, requireAuth, validateSpotOwner, async (req, res) => {
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
  const {id, firstName, lastName} = req.user
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
        userId: id,
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
      userId: id,
      spotId: req.params.spotId
    });

    // Get the created review data including createdAt and updatedAt
    // const createdReview = await Review.findByPk(newReview.id, {
    //   attributes: [
    //     'id',
    //     'userId',
    //     'spotId',
    //     'review',
    //     'stars',
    //     'createdAt',
    //     'updatedAt'
    //   ]
    // });

    res.status(201).json({User: {id, firstName, lastName}, id: newReview.id, review: newReview.review, stars: newReview.stars, createdAt: newReview.createdAt, updatedAt: newReview.updatedAt})

    // return res.json(createdReview);
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
  } else {
    const reviews = findSpot.Reviews;

    const formattedReviews = reviews.map(review => {
      return {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: {
          id: review.User.id,
          firstName: review.User.firstName,
          lastName: review.User.lastName,
        },
        ReviewImages: review.ReviewImages.map(reviewImage => {
          return {
            id: reviewImage.id,
            url: reviewImage.url,
          };
        }),
      };
    });

    return res.json({ Reviews: formattedReviews });
  }
});

//Create Booking from Spot based on SpotId
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found",
          statusCode: 404
      });
  }

  if(req.user.id === spot.ownerId){
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403
  });
  }

  const { startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
      return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          errors: ["endDate cannot be on or before startDate"]
      });
  }

  const allBookings = await Booking.findAll({
      include: {
          model: Spot,
          where: { id: req.params.spotId }
      }
  });

  const isBooked = allBookings.some(booking =>
      start.getTime() <= booking.startDate.getTime() && booking.startDate.getTime() <= end.getTime() ||
      booking.startDate.getTime() <= start.getTime() && end.getTime() <= booking.endDate.getTime() ||
      start.getTime() <= booking.endDate.getTime() && booking.endDate.getTime() <= end.getTime());

  if (!isBooked) {
      const newBooking = await Booking.create({
          userId: req.user.id,
          spotId: req.params.spotId,
          startDate,
          endDate,
      });
      return res.status(201).json(newBooking);
  } else {
      return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          statusCode: 403,
          errors: [
              "Start date conflicts with an existing booking",
              "End date conflicts with an existing booking"
          ]
      });
  }
});



//Get Bookings from Spot Id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (spot.ownerId === req.user.id) {
    const bookings = await Booking.findAll({
      include: {
        model: User,
        attributes: {
          exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt'],
        },
      },
      where: {
        spotId: req.params.spotId,
      },
    });
    return res.status(200).json({ Bookings: bookings });
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
      attributes: ['spotId', 'startDate', 'endDate'],
    });
    return res.status(200).json({ Bookings: bookings });
  }
});


module.exports = router;
