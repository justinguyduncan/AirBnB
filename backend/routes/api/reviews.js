const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');


const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { response } = require('express');


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

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    }

    if (review.userId !== userId) {
      return res.status(403).json({message: "Forbidden", statusCode: 403 });
    }

    const images = await ReviewImage.findAll({ where: { reviewId } });

    if (images.length >= 10) {
      return res.status(403).json({ message: "Maximum number of images have been added for the review", statusCode: 403 });
    }

    const newImage = await ReviewImage.create({ url, reviewId });

    return res.json({ id: newImage.id, url: newImage.url });
  });

//Get all Reviews of the Current User
  router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(reviews);
  });


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;

    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      where: {
        id: reviewId,
        userId: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    }

    existingReview.review = review;
    existingReview.stars = stars;

    const updatedReview = await existingReview.save();

    const reviewData = await Review.findByPk(reviewId, {
    //   include: [
    //     { model: User, attributes: ["id", "firstName", "lastName"] },
    //     { model: ReviewImage, attributes: ["id", "url"] }
    //   ],
      attributes: ["id", "userId", "spotId", "review", "stars", "createdAt", "updatedAt"]
    });

    res.json(reviewData);
  });

//Delete Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found", statusCode: 404 });
    }

    if (userId !== review.userId) {
      return res.status(403).json({  "message": "Forbidden", statusCode: 403 });
    }

    await review.destroy();

    return res.status(200).json({ message: "Successfully deleted", statusCode: 200 });
  });

module.exports = router
