const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Schema = mongoose.Schema
const { userGender } = require('../constants/user.constant');
const Track = mongoose.Schema(
    {
        content: {
            type: String,
            required: false,
            trim: false,
        },
        contentMeaning: {
            type: String,
            required: false
        },
        contentFurigana: {
            type: String,
            required: false
        },
        start: {
            type: String,
            default: '00:00:00',
            required: false
        },
        stop: {
            type: String,
            default: '00:00:00',
            required: false
        },
        role: {
            type: Number,
            required: false,
            default: userGender.MALE, // 1 for male: 2 for female
        },
        audioSrc: {
            type: String,
            required: false,
            trim: false,
        },        
    }, {
        _id: false,
    }
)

const DialogBoardSchema = mongoose.Schema(
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
            default: 1, // 1 = free
        },
        tracks: {
            type: [Track],
            require: false
        }
    },
    {
        timestamps: true,
    }        
);
// add plugin that converts mongoose to json
DialogBoardSchema.plugin(toJSON);
DialogBoardSchema.plugin(paginate);
/**
 * Check if a title is taken
 * @param {string} title - The board's title
 * @param {ObjectId} [excludeBoardId] - The id of the board to be excluded
 * @returns {Promise<boolean>}
 */
DialogBoardSchema.statics.isTitleTaken = async function (title, excludeBoardId, level) {
    const board = await this.findOne({ title, _id: { $ne: excludeBoardId }, level: { $eq: level} });
    return !!board;
};

DialogBoardSchema.statics.isTitleTakenForCreating = async function (title, level) {
    const board = await this.findOne({ title, level: { $eq: level} });
    return !!board;
};

/**
 * @typedef Board
 */
const DialogBoard = mongoose.model('DialogBoard', DialogBoardSchema);

module.exports = DialogBoard;
