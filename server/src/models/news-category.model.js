const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema;
const NewsCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: false,
      unique: true,
    },
    description: {
      type: String,
      required: false,
      trim: false,
    },
    children: {
      type: [{ type: Schema.Types.ObjectId, ref: 'NewsCategory' }],
      required: false,
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
NewsCategorySchema.plugin(toJSON);
NewsCategorySchema.plugin(paginate);

/**
 * @typedef NewsCategory
 */
const NewsCategory = mongoose.model('NewsCategory', NewsCategorySchema);

module.exports = NewsCategory;
