const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Quiz = mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: false,
            unique: true,
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

const SubTestSchema = mongoose.Schema(
    {
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
        type: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 1,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
SubTestSchema.plugin(toJSON);
SubTestSchema.plugin(paginate);

SubTestSchema.pre('validate', function validate(next) {
    var unique = [];

    for (var i = 0, l = this.quiz.length; i < l; i++) {
        let question = this.quiz[i].question;

        if (unique.indexOf(question) > -1) {
            return next(new Error('Câu hỏi trùng trong bài!'));
        }

        unique.push(question);
    }

    next();
});

/**
 * @typedef SubTest
 */
const SubTest = mongoose.model('SubTest', SubTestSchema);

module.exports = SubTest;
