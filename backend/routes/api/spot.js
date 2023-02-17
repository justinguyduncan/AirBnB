const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

//Get All Spots
// Define a route for getting all spots.
router.get('/', async (req, res) => {
  let spots = [];

  spots = await Spot.findAll({
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
        'price'
    ]

  })
  return res.json(spots);
});

//Get All Spots Owned by Current User
router.get('/current', requireAuth, async (req, res) => {

    let currSpots = [];

    currSpots = await Spot.findAll({
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
            'price'
        ]
    })
    return res.json(currSpots)
});

module.exports = router;
