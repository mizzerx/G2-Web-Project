const Image = require('../models/image.model');
const Topic = require('../models/topic.model');
const Article = require('../models/article.model');
const User = require('../models/user.model');
const { uploadImagesFile } = require('./upload.controller');

/**
 * Create Articles
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createArticle = async (req, res, next) => {
  const { title, content, topic_name } = req.body;
  const { user } = req.session.passport;

  const images = await uploadImagesFile(req.files);

  const uploadedImages = [...user.uploadedImages];

  images.map(async (img) => {
    const image = new Image(img);
    await image.save();
    uploadedImages.push(image._id);
  });

  const topic = await Topic.findOne({ name: topic_name });

  if (topic) {
    const newArticle = new Article({
      title,
      content,
      topic: topic._id,
      owner: user._id,
      faculty: user.faculty,
    });
    await newArticle.save();
    const uploadedArticles = [...user.uploadedArticles, newArticle._id];
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { uploadedArticles, uploadedImages } },
      { new: true }
    );

    console.log(updateUser);
  }
};

module.exports = { createArticle };
