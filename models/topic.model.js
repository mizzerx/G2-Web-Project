const { Schema, model, Types } = require('mongoose');

const TopicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firstClosureDate: {
      type: Date,
      required: true,
      default: new Date().getTime(),
    },
    finalClosureDate: {
      type: Date,
      required: true,
      default: new Date().setDate(new Date().getDate() + 20),
    },
    articles: [
      {
        type: Types.ObjectId,
        ref: 'articles',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('topics', TopicSchema);
