const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema

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
            type: Boolean,
            required: true,
            default: false
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
