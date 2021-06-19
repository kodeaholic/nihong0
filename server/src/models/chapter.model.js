const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema
const ChapterSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: false,
        },
        description: {
            type: String,
            required: false,
            trim: false,
        },
        meaning: {
            type: String,
            required: false,
            trim: false
        },
        topic: {
            type: Schema.Types.ObjectId, ref: 'Topic',
            required: false,
        },
    }
)
// add plugin that converts mongoose to json
ChapterSchema.plugin(toJSON);
ChapterSchema.plugin(paginate);

/**
 * @typedef Chapter
 */
const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;
