const { Schema, model, Types } = require('mongoose');

const ArticleSchema = new Schema(
  {
    uploadedWord: [
      {
        type: Types.ObjectId,
        ref: 'documents',
      },
    ],
    topic: {
      type: Types.ObjectId,
      ref: 'topics',
    },
    owner: {
      type: Types.ObjectId,
      ref: 'users',
    },
    faculty: {
      type: Types.ObjectId,
      ref: 'faculty',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('articles', ArticleSchema);
