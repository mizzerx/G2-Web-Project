const { Schema, model, Types } = require('mongoose');

const DocumentSchema = new Schema(
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

module.exports = model('documents', DocumentSchema);
