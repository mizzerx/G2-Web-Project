const { Schema, model, Types } = require('mongoose');

const ImageSchema = new Schema(
  {
    cloud_id: {
      type: String,
      required: true,
    },
    cloud_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('images', ImageSchema);
