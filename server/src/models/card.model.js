const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cardSchema = mongoose.Schema(
  {
    letter: {
      type: String,
      required: true,
      trim: false,
      unique: true
    },
    meaning: {
      type: String,
      required: true,
      trim: false,
    },
    note: { // tips to memorize
      type: String,
      required: false,
      trim: false,
    },
    onText: {
        type: String,
        required: false,
        trim: false
    },
    onTextExample: {
        type: String,
        required: false,
        trim: false,
    }, 
    kunText: {
        type: String,
        required: false,
        trim: false,
    },
    kunTextExample: {
        type: String,
        required: false,
        trim: false,
    },
    svgSrc: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cardSchema.plugin(toJSON);
cardSchema.plugin(paginate);

/**
 * @typedef Card
 */
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
