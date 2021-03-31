const Image = require('../models/image.model');
const Topic = require('../models/topic.model');
const Article = require('../models/article.model');
const User = require('../models/user.model');
const Faculty = require('../models/faculty.model');
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

  const newArticle = new Article({
    title,
    content,
    topic: topic_name,
    owner: user._id,
    faculty: user.faculty,
  });
  await newArticle.save();

  const topic = await Topic.findOne({ name: topic_name });
  const topicArticles = [...topic.articles, newArticle._id];
  await Topic.findOneAndUpdate(
    { name: topic_name },
    { $set: { articles: topicArticles } },
    { new: true }
  );

  const faculty = await Faculty.findOne({ name: user.faculty });
  const facultyArticles = [...faculty.articles, newArticle._id];
  await Faculty.findOneAndUpdate(
    { name: user.faculty },
    { $set: { articles: facultyArticles } },
    { new: true }
  );

  const uploadedArticles = [...user.uploadedArticles, newArticle._id];
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { uploadedArticles, uploadedImages } },
    { new: true }
  );

  return res.redirect('/student/profile');
};

module.exports = { createArticle };
