const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const { DEFAULT_QUIZ_QUESTIONS } = require('../utils/defaultQuizQuestions');

// @desc    Create a new MCQ question
// @route   POST /api/quiz/questions
// @access  Private (for now; can be restricted to admin role later)
const createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswerIndex, category, difficulty } = req.body;

    if (!questionText || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'questionText and at least 2 options are required.',
      });
    }

    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({
        success: false,
        message: 'correctAnswerIndex must be within options range.',
      });
    }

    const question = await QuizQuestion.create({
      questionText,
      options,
      correctAnswerIndex,
      category,
      difficulty,
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz question created successfully.',
      question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create quiz question.',
      error: error.message,
    });
  }
};

// @desc    Get all quiz questions for test attempt
// @route   GET /api/quiz/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    let questions = await QuizQuestion.find().select('-correctAnswerIndex').sort({ createdAt: 1 });

    // Seed starter questions if none exist so first-time users can immediately attempt a quiz.
    if (questions.length === 0) {
      await QuizQuestion.insertMany(DEFAULT_QUIZ_QUESTIONS);
      questions = await QuizQuestion.find().select('-correctAnswerIndex').sort({ createdAt: 1 });
    }

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz questions.',
      error: error.message,
    });
  }
};

// @desc    Submit quiz answers and store score
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'answers array is required.',
      });
    }

    const questionIds = answers.map((item) => item.questionId);
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid questions found for submitted answers.',
      });
    }

    const questionMap = new Map(questions.map((question) => [String(question._id), question]));

    let correctAnswers = 0;
    const responseDetails = [];
    const resultBreakdown = [];

    for (const answer of answers) {
      const question = questionMap.get(String(answer.questionId));
      if (!question) {
        continue;
      }

      const selectedAnswerIndex = Number(answer.selectedOption);
      const isCorrect = selectedAnswerIndex === question.correctAnswerIndex;

      if (isCorrect) {
        correctAnswers += 1;
      }

      responseDetails.push({
        question: question._id,
        selectedAnswerIndex,
        isCorrect,
      });

      // Result payload to show immediate feedback after submission.
      resultBreakdown.push({
        questionId: question._id,
        questionText: question.questionText,
        selectedAnswerIndex,
        correctAnswerIndex: question.correctAnswerIndex,
        isCorrect,
      });
    }

    const totalQuestions = responseDetails.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      totalQuestions,
      correctAnswers,
      score,
      responses: responseDetails,
    });

    return res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully.',
      result: {
        attemptId: attempt._id,
        totalQuestions,
        correctAnswers,
        score,
        breakdown: resultBreakdown,
        submittedAt: attempt.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit quiz.',
      error: error.message,
    });
  }
};

// @desc    Get logged-in user's quiz history
// @route   GET /api/quiz/history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizAttempt.find({ user: req.user._id })
      .select('score totalQuestions correctAnswers createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz history.',
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  submitQuiz,
  getQuizHistory,
};
