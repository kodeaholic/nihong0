const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('./plugins');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { extractTextFromHTMLString } = require('../helpers/dom');
const Schema = mongoose.Schema;
const VocabSchema = mongoose.Schema(
  {
    vocab: {
      type: String,
      required: true,
      trim: false,
    },
    chinese: {
      type: String,
      required: false,
      trim: false,
    },
    vocabMeaning: {
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
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: false,
    },
    orderInParent: {
      type: Number,
      required: false,
      default: 1000, // latest vocab created will be at the bottom of the vocab list
    },
    extractedVocab: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
// add plugin that converts mongoose to json
VocabSchema.plugin(toJSON);
VocabSchema.plugin(paginate);

/**
 * @typedef Vocab
 */
const Vocab = mongoose.model('Vocab', VocabSchema);

module.exports = Vocab;
