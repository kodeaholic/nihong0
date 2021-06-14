const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema

const VocabSchema = mongoose.Schema(
    {
        vocab: {
            type: String, 
            required: true,
            trim: false
        },
        vocabMeaning: {
            type: String,
            required: true,
            trim: false,
        },
        example: {
            type: String,
            required: false,
            trim: false
        },
        exampleMeaning: {
            type: String,
            required: false,
            trim: false
        },
        // vocabPronounce: {
        //     type: String,
        //     trim: false,
        //     required: false,
        // },
        // examplePronounce: {
        //     type: String,
        //     required: false,
        //     trim: false
        // },
        audioSrc: {
            type: String,
            required: false,
            trim: false
        }
    },
    { timestamps: true }
)

const LessonSchema = mongoose.Schema(
    {
        title: {
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
        vocab: {
            type: [VocabSchema],
            required: false
        }
    },
    { timestamps: true }
)

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
        lessons: {
            type: [LessonSchema],
            required: false
        }
    }
)

const TopicSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: false,
            unique: true
        },
        description: {
            type: String,
            required: false,
            trim: false,
        },
        chapters: {
            type: [ChapterSchema],
            required: false
        }
    },
    {
        timestamps: true,
    }        
);
// add plugin that converts mongoose to json
TopicSchema.plugin(toJSON);
TopicSchema.plugin(paginate);
/**
 * Check if a name is taken
 * @param {string} name - The topic's name
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
TopicSchema.statics.isNameTaken = async function (name, excludeBoardId) {
    const topic = await this.findOne({ name, _id: { $ne: excludeBoardId } });
    return !!topic;
};

/**
 * @typedef Topic
 */
const Topic = mongoose.model('Topic', TopicSchema);

/**
 * @typedef Chapter
 */
const Chapter = mongoose.model('Chapter', ChapterSchema);

/**
 * @typedef Lesson
 */
const Lesson = mongoose.model('Lesson', LessonSchema);

/**
 * @typedef Vocab
 */
const Vocab = mongoose.model('Vocab', VocabSchema);

module.exports = {
    Topic,
    Chapter,
    Lesson,
    Vocab
};
