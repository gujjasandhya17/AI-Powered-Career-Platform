const ResumeAnalysis = require('../models/ResumeAnalysis');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Protected dashboard endpoint (starter)
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const latestResumeAnalysis = await ResumeAnalysis.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('score matchedSkills missingSkills suggestions createdAt fileName');

    const quizHistory = await QuizAttempt.find({ user: req.user._id })
      .select('score totalQuestions correctAnswers createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: 'Welcome to your dashboard.',
      user: req.user,
      data: {
        resumeAnalysis: latestResumeAnalysis,
        quizHistory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data.',
      error: error.message,
    });
  }
};

module.exports = { getDashboard };
