const Faculty = require('../models/faculty.model');
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
    const faculty = await Faculty.findOne({ name: faculty_name });

    if (!faculty) throw new Error('Faculty is not existed');

    const newUser = new User({
      email,
      username,
      password,
      role,
      faculty: faculty._id,
    });

    const user = await newUser.save();

    if (!user) throw new Error('Cannot create user');

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

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) throw new Error('User not found');

    return res.status(200).redirect('/admin');
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, deleteUser };
