const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema
const LessonSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        meaning: {
            type: String,
            required: false
        },
        audioSrc: {
            type: String,
            required: false
        },
        chapter: {
            type: Schema.Types.ObjectId, ref: 'Chapter',
            required: false,
        }
    },
    { timestamps: true }
)
// add plugin that converts mongoose to json
LessonSchema.plugin(toJSON);
LessonSchema.plugin(paginate);

/**
 * @typedef Lesson
 */
const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
