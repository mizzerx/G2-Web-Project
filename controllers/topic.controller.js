const Topic = require('../models/topic.model');

const createTopic = async (req, res, next) => {
  const { name, firstClosureDate, finalClosureDate, faculty } = req.body;

  try {
    const newTopic = new Topic({ name, firstClosureDate, finalClosureDate, faculty });
    const result = await newTopic.save();

    if (result) return res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  const { firstClosureDate, finalClosureDate, id } = req.body;
  const update = {};

  if (firstClosureDate) update.firstClosureDate = new Date(firstClosureDate);
  if (finalClosureDate) update.finalClosureDate = new Date(finalClosureDate);

  await Topic.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

  return res.redirect('/admin');
};

module.exports = { createTopic, updateTopic };
