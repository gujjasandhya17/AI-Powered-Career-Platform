const mongoose = require('mongoose');

// Stores user's quiz attempt summary and per-question response details.
const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    responses: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QuizQuestion',
          required: true,
        },
        selectedAnswerIndex: {
          type: Number,
          required: true,
          min: 0,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
