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
    }, {
    _id: false,
}
)

const GrammarSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
            trim: false,
        },
        title: {
            type: String,
            required: true,
            trim: false,
        },
        content: {
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
            require: true
        },
        meaning: {
            type: String,
            required: false,
            trim: false,
        },
        usage: {
            type: String,
            required: false,
            trim: false,
        },
        example: {
            type: String,
            required: false,
            trim: false,
        },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
GrammarSchema.plugin(toJSON);
GrammarSchema.plugin(paginate);

/**
 * @typedef Grammar
 */
const Grammar = mongoose.model('Grammar', GrammarSchema);

module.exports = Grammar;
