const Image = require('../models/image.model');
const Topic = require('../models/topic.model');
const Article = require('../models/article.model');
const User = require('../models/user.model');
const Faculty = require('../models/faculty.model');
const { uploadImagesFile } = require('./upload.controller');
const { Types } = require('mongoose');
const { findIndex } = require('../helpers/findIndex.helper');

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

  const uploadedImages = [];

  if (images && images.length > 0) {
    images.map(async (img) => {
      const image = new Image(img);
      await image.save();
      uploadedImages.push(image._id);
    });
  }

  const newArticle = await new Article({
    title,
    content,
    topic: topic_name,
    owner: user._id,
    faculty: user.faculty,
  }).save();

  await Topic.findOneAndUpdate(
    { name: topic_name },
    { $push: { articles: newArticle._id } },
    { new: true }
  );

  await Faculty.findOneAndUpdate(
    { name: user.faculty },
    { $push: { articles: newArticle._id } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    user._id,
    {
      $push: {
        uploadedArticles: newArticle._id,
        uploadedImages: { $each: uploadedImages },
      },
    },
    { new: true }
  );

  return res.redirect('/student/profile');
};

const removeAricle = async (req, res, next) => {
  const { id, topic_name, faculty_name } = req.body;
  const { _id } = req.session.passport.user;

  await Topic.findOneAndUpdate(
    { name: topic_name },
    { $pull: { articles: { $in: id } } },
    { new: true }
  );

  await Faculty.findOneAndUpdate(
    { name: faculty_name },
    { $pull: { articles: { $in: id } } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id },
    { $pull: { uploadedArticles: { $in: id } } },
    { new: true }
  );

  await Article.findOneAndRemove({ _id: id });

  return res.redirect('/student/profile');
};

const updateArticle = async (req, res, next) => {
  const { title, content, id } = req.body;

  await Article.findByIdAndUpdate(
    id,
    { $set: { title, content } },
    { new: true }
  );

  return res.redirect('/student/profile');
};

const makeArticleFeedback = async (req, res, next) => {
  const { id, comment, status } = req.body;

  await Article.findByIdAndUpdate(
    id,
    { $set: { comment: comment.trim(), status } },
    { new: true }
  );

  return res.redirect('/coordinator');
};

module.exports = {
  createArticle,
  removeAricle,
  updateArticle,
  makeArticleFeedback,
};
