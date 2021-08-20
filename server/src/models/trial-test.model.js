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
        part: {
            type: Number,
            enum: [1, 2, 3, 4],
            default: '1',
            required: true,
        }
    }
)

const TrialTestSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: false,
        },
        level: {
            type: String,
            required: true,
            trim: false,
        },
        free: {
            type: Number,
            required: true,
            default: 1
        },
        time: {
            type: Number,
            required: true,
            default: 1
        },
        quiz: {
            type: [Quiz],
            require: true
        },
        vocabularyContent: {
            type: String,
            required: false,
            trim: false,
        },
        grammarContent: {
            type: String,
            required: false,
            trim: false,
        },
        readingContent: {
            type: String,
            required: false,
            trim: false,
        },
        listeningContent: {
            type: String,
            required: false,
            trim: false,
        },
        listeningAudioSrc: {
            type: String,
            required: true,
            trim: false,
        }
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
TrialTestSchema.plugin(toJSON);
TrialTestSchema.plugin(paginate);

TrialTestSchema.pre('validate', function validate(next) {
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
 * @typedef TrialTest
 */
const TrialTest = mongoose.model('TrialTest', TrialTestSchema);

module.exports = TrialTest;
