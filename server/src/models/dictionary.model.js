const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('./plugins');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { extractFuriganaFromHTMLString } = require('../helpers/dom');
const DictionarySchema = mongoose.Schema(
  {
    phrase: {
      type: String,
      required: true,
      trim: false,
      unique: true,
    },
    meaning: {
      type: String,
      required: false,
      trim: false,
    },
    example: {
      type: String,
      required: false,
      trim: false,
    },
    exampleMeaning: {
      type: String,
      required: false,
      trim: false,
    },
    audioSrc: {
      type: String,
      required: false,
      trim: false,
    },
    furigana: {
        type: String,
        required: false,
    },
    extractedFurigana: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
// add plugin that converts mongoose to json
DictionarySchema.plugin(toJSON);
DictionarySchema.plugin(paginate);

DictionarySchema.statics.exists = async function (phrase, excludeUserId) {
    const record = await this.findOne({ phrase: { $eq: phrase }, _id: { $ne: excludeUserId } });
    let found = !_.isEmpty(record)
    return found;
  };

DictionarySchema.pre('save', async function (next) {
    const doc = this;
    // extract furigana
    const furigana = doc.furigana
    if (furigana) {
        const decoded = htmlEntityDecode(furigana)
        doc.extractedFurigana = extractFuriganaFromHTMLString(decoded)
    }
    next();
  });

/**
 * @typedef Dictionary
 */
const Dictionary = mongoose.model('Dictionary', DictionarySchema);

module.exports = Dictionary;
