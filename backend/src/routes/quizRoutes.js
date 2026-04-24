const express = require('express');
const {
  createQuestion,
  getQuestions,
  submitQuiz,
  getQuizHistory,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/questions', protect, createQuestion);
router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);

module.exports = router;
