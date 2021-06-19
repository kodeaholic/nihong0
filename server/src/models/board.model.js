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

const BoardSchema = mongoose.Schema(
    {
        title: {
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
        level: { 
            type: String,
            required: false,
            trim: false,
        },
        cards: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
            validate: v => Array.isArray(v) && v.length > 0,
            required: true
        },
        free: {
            type: Number,
            required: true,
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
BoardSchema.plugin(toJSON);
BoardSchema.plugin(paginate);
/**
 * Check if a title is taken
 * @param {string} title - The board's title
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
BoardSchema.statics.isTitleTaken = async function (title, excludeBoardId) {
    const board = await this.findOne({ title, _id: { $ne: excludeBoardId } });
    return !!board;
};

/**
 * @typedef Board
 */
const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;
