const DEFAULT_QUIZ_QUESTIONS = [
  {
    questionText: 'Which of the following is a NoSQL database?',
    options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
    correctAnswerIndex: 1,
    category: 'Database',
    difficulty: 'easy',
  },
  {
    questionText: 'What does JWT stand for?',
    options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Token', 'Joint Web Token'],
    correctAnswerIndex: 1,
    category: 'Authentication',
    difficulty: 'easy',
  },
  {
    questionText: 'Which HTTP method is typically used to update a resource?',
    options: ['GET', 'POST', 'PUT', 'OPTIONS'],
    correctAnswerIndex: 2,
    category: 'API',
    difficulty: 'easy',
  },
  {
    questionText: 'In JavaScript, which keyword declares a block-scoped variable?',
    options: ['var', 'const', 'let', 'both const and let'],
    correctAnswerIndex: 3,
    category: 'JavaScript',
    difficulty: 'medium',
  },
  {
    questionText: 'Which React hook is used for side effects?',
    options: ['useState', 'useMemo', 'useEffect', 'useRef'],
    correctAnswerIndex: 2,
    category: 'React',
    difficulty: 'easy',
  },
];

module.exports = { DEFAULT_QUIZ_QUESTIONS };
