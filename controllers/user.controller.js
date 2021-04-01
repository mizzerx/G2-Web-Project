const Article = require('../models/article.model');
const Faculty = require('../models/faculty.model');
const Topic = require('../models/topic.model');
const User = require('../models/user.model');

/**
 * Create User
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createUser = async (req, res, next) => {
  const { email, username, password, role, faculty_name } = req.body;

  try {
    const newUser = await new User({
      email,
      username,
      password,
      role,
      faculty: faculty_name || '',
    }).save();

    await Faculty.findOneAndUpdate(
      { name: faculty_name },
      { $push: { users: newUser._id } },
      { new: true }
    );

    return res.status(201).redirect('/admin');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete User
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteUser = async (req, res, next) => {
  const { id } = req.body;

  if (id === '606440bd43485242fc9684b6')
    return res.status(200).redirect('/admin');
  try {
    await Faculty.findOneAndUpdate(
      { _id: id },
      { $pull: { users: { $in: id } } },
      { new: true }
    );

    const user = await User.findOne({ _id: id }).populate('uploadedArticles');
    const articles = [...user.uploadedArticles];
    articles.map(async (val) => {
      await Topic.findOneAndUpdate(
        { name: val.topic },
        { $pull: { articles: { $in: val._id } } },
        { new: true }
      );

      await Faculty.findOneAndUpdate(
        { name: val.faculty },
        { $pull: { articles: { $in: val_id } } },
        { new: true }
      );

      val.remove();
    });

    await user.remove();

    return res.status(200).redirect('/admin');
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, deleteUser };
