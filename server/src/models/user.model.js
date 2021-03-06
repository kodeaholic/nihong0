const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const CompletedItem = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: false,
    },
    time: {
      type: Number,
      required: true,
    },
    program: {
      type: String,
      required: true,
      trim: false,
    },
    level: {
      type: String,
      required: true,
      trim: false,
    },
    itemId: {
      type: String,
      required: true,
      trim: false,
    },
  },
  {
    _id: false,
  }
);

const Activity = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: false,
    },
    time: {
      type: Number,
      required: true,
    }
  },
  {
    _id: false,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      required: false,
      trim: false,
      default: '',
    },
    provider: {
      type: String,
      required: false,
      trim: false,
    },
    providerUserId: {
      type: String,
      required: false,
      trim: false,
    },
    socialUserDetails: {
      type: String,
      required: false,
      trim: false,
    },
    completedItems: {
      type: [CompletedItem],
      required: false,
    },
    activities: {
      type: [Activity],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
