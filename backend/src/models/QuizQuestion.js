const mongoose = require('mongoose');

// Stores MCQ questions for quiz system.
const quizQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: 'At least 2 options are required.',
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
