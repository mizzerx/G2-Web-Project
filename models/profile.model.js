const { Schema, model, Types } = require('mongoose');

const ProfileSchema = new Schema({
  fullName: String,
  personal_id: String,
  imageProfile: {
    type: Types.ObjectId,
    ref: 'images',
  },
  owner: {
    type: Types.ObjectId,
    ref: 'users',
  },
});

module.exports = model('profiles', ProfileSchema);
