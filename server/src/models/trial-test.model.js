const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Quiz = mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: false,
    unique: true,
  },
  A: {
    type: String,
    required: true,
  },
  B: {
    type: String,
    required: true,
  },
  C: {
    type: String,
    required: true,
  },
  D: {
    type: String,
    required: true,
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
  },
  point: {
    type: Number,
    default: 0,
    required: true,
  },
  group: {
    type: String,
    required: true,
    trim: false,
  },
  content: {
    type: String,
    required: false,
    trim: false,
  }
});

const QuizGroup = mongoose.Schema(
  {
    part: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: '1',
      required: true,
    },
    title: {
      type: String,
      required: false,
      trim: false,
    },
    uuid: {
      type: String,
      required: true,
      trim: false,
    },
    exampleQuiz: {
      type: String,
      required: false,
      trim: false,
    }
  },
  {
    _id: false,
  }
);

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
      default: 1,
    },
    time_part_1: {
      type: Number,
      required: true,
      default: 1,
    },
    time_part_2: {
      type: Number,
      required: true,
      default: 1,
    },
    quiz: {
      type: [Quiz],
      required: true,
    },
    quizGroups: {
      type: [QuizGroup],
      require: true,
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
      required: false,
      trim: false,
    },
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
      return next(new Error('C??u h???i tr??ng trong b??i!'));
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
