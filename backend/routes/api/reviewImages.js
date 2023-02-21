const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//Delete an Image for a Review
router.delete('/:imageId', async (req, res) => {
    const user = req.user.id;


    const image = await ReviewImage.findByPk(req.params.imageId, { include: Review });

    if (!image) {
      return res.status(404).json({
        message: "Review Image couldn't be found",
        statusCode: 404
      });
    }


    if (image.Review.userId !== user) {
      return res.status(403).json({
        message: "You are not authorized to delete images for this spot",
        statusCode: 403
      });
    }


    await image.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200
    });
  });



module.exports = router;
