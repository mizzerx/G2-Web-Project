const Faculty = require('../models/faculty.model');

/**
 * Create faculty
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createFaculty = async (req, res, next) => {
  const { name } = req.body;

  try {
    const newFaculty = new Faculty({ name });
    const faculty = await newFaculty.save();

    return res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
};

module.exports = { createFaculty };
