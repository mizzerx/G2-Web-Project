const { Schema, model, Types } = require('mongoose');
const { hash, compare } = require('bcryptjs');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'COORDINATOR', 'STUDENT', 'GUEST'],
      default: 'STUDENT',
    },
    faculty: {
      type: Types.ObjectId,
      ref: 'faculties',
    },
    profile: {
      type: Types.ObjectId,
      ref: 'profiles',
    },
    uploadedImages: [
      {
        type: Types.ObjectId,
        ref: 'images',
      },
    ],
    uploadedArticles: [
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

UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified() || !user.isNew) {
    next();
    return;
  }

  try {
    const hashed = await hash(user.password, 10);
    user.password = hashed;
  } catch (error) {
    next(error);
  }
});

UserSchema.method({
  async validatePassword(raw) {
    const user = this;

    try {
      const isSame = await compare(raw, user.password);

      return isSame;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

module.exports = model('users', UserSchema);
