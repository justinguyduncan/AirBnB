const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//Delete an Image for a Spot
router.delete('/:imageId', async (req, res) => {
    const user = req.user.id;

    // Find the image by ID and include the Spot relation
    const image = await SpotImage.findByPk(req.params.imageId, { include: Spot });

    if (!image) {
      return res.status(404).json({
        message: "Spot image couldn't be found",
        statusCode: 404
      });
    }

    // Check if the user owns the spot that the image belongs to
    if (image.Spot.ownerId !== user) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403
      });
    }

    // Delete the image
    await image.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200
    });
  });


module.exports = router;
