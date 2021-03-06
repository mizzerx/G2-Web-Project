const { Schema, model, Types } = require('mongoose');

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    ariticleImage: String,
    uploadedWord: [
      {
        type: Types.ObjectId,
        ref: 'documents',
      },
    ],
    topic: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'users',
    },
    faculty: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('articles', ArticleSchema);
