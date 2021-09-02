const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema;
const NewsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: false,
      unique: true,
    },
    content: {
      type: String,
      required: false,
      trim: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'NewsCategory',
      required: false,
      trim: false,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
NewsSchema.plugin(toJSON);
NewsSchema.plugin(paginate);

/**
 * @typedef News
 */
const News = mongoose.model('News', NewsSchema);

module.exports = News;
