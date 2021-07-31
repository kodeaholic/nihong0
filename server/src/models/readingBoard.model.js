const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
        },
        question_vn: {
            type: String,
            required: true,
            trim: false,
        },
        A_vn: {
            type: String,
            required: true
        },
        B_vn: {
            type: String,
            required: true
        },
        C_vn: {
            type: String,
            required: true
        },
        D_vn: {
            type: String,
            required: true
        },
        
    }, {
        _id: false,
    }
)

const ReadingBoardSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: false,
            // unique: false,
        },
        content: {
            type: String,
            required: false,
            trim: false,
        },
        content_vn: {
            type: String,
            required: false,
            trim: false,
        },
        level: { 
            type: String,
            required: false,
            trim: false,
        },
        free: {
            type: Number,
            required: true,
            default: 1
        },
        quiz: {
            type: [Quiz],
            require: false
        },
        tooltipContent: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }        
);
// add plugin that converts mongoose to json
ReadingBoardSchema.plugin(toJSON);
ReadingBoardSchema.plugin(paginate);
/**
 * Check if a title is taken
 * @param {string} title - The board's title
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
ReadingBoardSchema.statics.isTitleTaken = async function (title, excludeBoardId, level) {
    const board = await this.findOne({ title, _id: { $ne: excludeBoardId }, level: { $eq: level} });
    return !!board;
};
ReadingBoardSchema.statics.isTitleTakenForCreating = async function (title, level) {
    const board = await this.findOne({ title, level: { $eq: level} });
    return !!board;
};
/**
 * @typedef ReadingBoard
 */
const ReadingBoard = mongoose.model('ReadingBoard', ReadingBoardSchema);

module.exports = ReadingBoard;
