const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema

const Quiz = mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: false,
        },
        A: {
            type: String,
            required: true
        },
        B: {
            type: String,
            required: true
        },
        C: {
            type: String,
            required: true
        },
        D: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            default: 'A',
            required: true,
        }
        
    }, {
        _id: false,
    }
)

const ListeningBoardSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: false,
            // unique: false,
        },
        script: {
            type: String,
            required: false,
            trim: false,
        },
        subtitle: {
            type: String,
            required: false,
            trim: false,
        },
        level: { 
            type: String,
            required: false,
            trim: false,
        },
        audioSrc: {
            type: String,
            required: false,
            trim: false,
        },
        free: {
            type: Number,
            required: false,
            default: 1
        },
        quiz: {
            type: [Quiz],
            require: false
        }
    },
    {
        timestamps: true,
    }        
);
// add plugin that converts mongoose to json
ListeningBoardSchema.plugin(toJSON);
ListeningBoardSchema.plugin(paginate);
/**
 * Check if a title is taken
 * @param {string} title - The board's title
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
ListeningBoardSchema.statics.isTitleTaken = async function (title, excludeBoardId, level) {
    const board = await this.findOne({ title, _id: { $ne: excludeBoardId }, level: { $eq: level} });
    return !!board;
};

ListeningBoardSchema.statics.isTitleTakenForCreating = async function (title, level) {
    const board = await this.findOne({ title, level: { $eq: level} });
    return !!board;
};

/**
 * @typedef Board
 */
const ListeningBoard = mongoose.model('ListeningBoard', ListeningBoardSchema);

module.exports = ListeningBoard;
