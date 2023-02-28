const express = require('express');
const { setTokenCookie, requireAuth,} = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage,  Booking  } = require('../../db/models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { response } = require('express');

router.get('/current', requireAuth, async (req, res) => {
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
        group: ['Spot.id', 'SpotImages.url']
      });

      const bookings = await Booking.findAll({
        where: {
          userId: req.user.id
        },
        include: {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        },
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
      });

      const result = bookings.map((booking) => {
        const spot = booking.Spot;
        const spotImages = spots.filter(s => s.id === spot.id)[0]?.SpotImages || [];
        const previewImage = spotImages[0]?.url;
        return {
          id: booking.id,
          spotId: spot.id,
          Spot: {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            price: spot.price,
            previewImage: previewImage || null
          },
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        };
      });

      return res.status(200).json({
        Bookings: result
      });
  });



  //Edit a booking
  router.put('/:bookingId', requireAuth, async (req, res) => {

    const { startDate, endDate } = req.body;

    const updateBooking = await Booking.findByPk(req.params.bookingId, {
        include: {
          model: Spot,
          attributes: ['ownerId'],
        },
      });

    if (!updateBooking) {
      return res.status(404).json({ message: "Booking couldn't be found", statusCode: 404 });
    }

    if (updateBooking.userId !== req.user.id && updateBooking.Spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden", statusCode: 403 });
      }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors: ['endDate cannot be on or before startDate']
      });
    }

    if (start.getTime() < updateBooking.endDate.getTime() && updateBooking.endDate.getTime() < new Date()) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
        statusCode: 403
      });
    }

    const overlappingBooking = await Booking.findOne({
      where: {
        spotId: updateBooking.spotId,
        [Op.and]: [
          { startDate: { [Op.lt]: end } },
          { endDate: { [Op.gt]: start } },
          { id: { [Op.ne]: updateBooking.id } }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: [
          'Start date conflicts with an existing booking',
          'End date conflicts with an existing booking'
        ]
      });
    }

    updateBooking.startDate = startDate;
    updateBooking.endDate = endDate;

    await updateBooking.save();
    const updatedBooking = await Booking.findByPk(req.params.bookingId);
    return res.json(updatedBooking);
  });

//Delete Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const deleteBooking = await Booking.findByPk(req.params.bookingId, {
        include: {
          model: Spot,
          attributes: ['ownerId'],
        },
      });


      if (!deleteBooking) {
          return res.status(404).json({ message: "Booking couldn't be found", statusCode: 404 });
        }

     if (deleteBooking.userId !== req.user.id && deleteBooking.Spot.ownerId !== req.user.id) {
          return res.status(403).json({ message: "Forbidden", statusCode: 403 });
        }

    await deleteBooking.destroy();

    return res.status(200).json({ message: "Successfully deleted", statusCode: 200 });
  });


module.exports = router;
