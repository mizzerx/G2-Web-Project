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

  const image = await Image.findOne({ _id: uploadedImages[0] });

  const newArticle = new Article({
    title,
    content,
    topic: topic_name,
    owner: user._id,
    faculty: user.faculty,
    articleImage: image.cloud_url,
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
  await User.findByIdAndUpdate(
    user._id,
    { $set: { uploadedArticles, uploadedImages } },
    { new: true }
  );

  return res.redirect('/student/profile');
};

const removeAricle = async (req, res, next) => {
  const { id, topic_name } = req.body;
  const { user } = req.session.passport;

  const userArticles = [...user.uploadedArticles];
  const i = userArticles.indexOf(id);
  if (i > -1) userArticles.splice(i, 1);

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: { uploadedArticles: userArticles },
    },
    { new: true }
  );

  const faculty = await Faculty.findOne({ name: user.faculty });
  const facultyArticles = [...faculty.articles];
  const j = facultyArticles.indexOf(id);
  if (j > -1) facultyArticles.splice(j, 1);
  await Faculty.findByIdAndUpdate(
    faculty._id,
    {
      $set: { articles: facultyArticles },
    },
    { new: true }
  );

  const topic = await Topic.findOne({ name: topic_name });
  const topicArticles = [...topic.articles];
  const k = topicArticles.indexOf(id);
  if (k > -1) topicArticles.splice(k, 1);
  await Topic.findByIdAndUpdate(
    topic._id,
    { $set: { articles: topicArticles } },
    { new: true }
  );

  await Article.findByIdAndDelete(id);

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
