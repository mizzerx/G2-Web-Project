const { Schema, model, Types } = require('mongoose');

const FacultySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  articles: [
    {
      type: Types.ObjectId,
      ref: 'articles',
    },
  ],
  users: [
    {
      type: Types.ObjectId,
      ref: 'users',
    },
  ],
});

module.exports = model('faculties', FacultySchema);
