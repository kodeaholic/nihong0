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
        required: false,
        trim: false,
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
 * Check if code is taken
 * @param {string} code - The letter's code
 * @param {ObjectId} [excludeCardId] - The id of the card to be excluded
 * @returns {Promise<boolean>}
 */
 cardSchema.statics.isCodeTaken = async function (code, excludeCardId) {
  const card = await this.findOne({ code, _id: { $ne: excludeCardId } });
  return !!card;
};

/**
 * Check if letter is taken
 * @param {string} letter - The letter's letter
 * @param {ObjectId} [excludeCardId] - The id of the card to be excluded
 * @returns {Promise<boolean>}
 */
 cardSchema.statics.isLetterTaken = async function (letter, excludeCardId) {
  const card = await this.findOne({ letter, _id: { $ne: excludeCardId } });
  return !!card;
};

/**
 * @typedef Card
 */
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
