const Topic = require('../models/topic.model');

const createTopic = async (req, res, next) => {
  const { name, firstClosureDate, finalClosureDate } = req.body;

  try {
    const newTopic = new Topic({ name, firstClosureDate, finalClosureDate });
    const result = await newTopic.save();

    if (result) return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTopic };
