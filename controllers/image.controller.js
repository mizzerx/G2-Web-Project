const User = require('../models/user.model');
const Image = require('../models/image.model');
const { uploadImagesFile } = require('./upload.controller');

const uploadImages = async (req, res, next) => {
  const { _id } = req.session.passport.user;
  const images = await uploadImagesFile(req.files);

  if (images && images.length > 0) {
    images.map(async (img) => {
      const image = await new Image(img).save();
      console.log(img);
      await User.findOneAndUpdate(
        { _id },
        { $push: { uploadedImages: image._id } },
        { new: true }
      );
    });
  }

  return res.redirect('/student/profile');
};

module.exports = { uploadImages };
