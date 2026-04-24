import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function QuizPage() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const [questionsResponse, historyResponse] = await Promise.all([
          api.getQuizQuestions(token),
          api.getQuizHistory(token),
        ]);
        setQuestions(questionsResponse.questions || []);
        setHistory(historyResponse.history || []);

        const totalSeconds = (questionsResponse.questions?.length || 0) * 60;
        setTimeLeft(totalSeconds);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [token]);

  useEffect(() => {
    if (loading || questions.length === 0 || timeUp) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          return 0;
        }
        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length, timeUp]);

  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).filter((key) => selectedAnswers[key] !== undefined).length,
    [selectedAnswers]
  );

  const completionPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const currentQuestionIndex = Math.min(answeredCount + 1, questions.length || 1);

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const handleOptionSelect = (questionId, optionIndex) => {
    if (timeUp) {
      return;
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    setError('');

    if (timeUp) {
      setError('Quiz time is over. Start a new attempt to continue.');
      return;
    }

    const answersPayload = questions.map((question) => ({
      questionId: question._id,
      selectedOption: Number(selectedAnswers[question._id]),
    }));

    if (answersPayload.some((item) => Number.isNaN(item.selectedOption))) {
      setError('Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await api.submitQuiz(token, answersPayload);
      setResult(response.result);
      setTimeUp(true);

      const updatedHistory = await api.getQuizHistory(token);
      setHistory(updatedHistory.history || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="quiz-page">
      <h2>Mock Test</h2>
      <p className="muted">Answer MCQ questions and submit to get instant score.</p>

      {loading ? <p>Loading quiz...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && questions.length === 0 ? (
        <article className="card">
          <p>No quiz questions available yet.</p>
          <p className="muted">Use backend endpoint POST /api/quiz/questions to add questions.</p>
        </article>
      ) : null}

      {!loading && questions.length > 0 ? (
        <>
          <article className="card quiz-summary-card">
            <div className="quiz-top-meta">
              <p className="status-chip">Question {currentQuestionIndex} of {questions.length}</p>
              <p className={timeUp ? 'timer-chip danger' : 'timer-chip'}>⏱ {formattedTime}</p>
            </div>

            <p className="muted">Answered {answeredCount} of {questions.length}</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="muted">Completion: {completionPercent}%</p>

            {timeUp ? <p className="error-text">Time is up for this attempt.</p> : null}

            {questions.map((question, index) => (
              <div className="question-block" key={question._id}>
                <h4>
                  Q{index + 1}. {question.questionText}
                </h4>

                <div className="options-grid">
                  {question.options.map((option, optionIndex) => (
                    <label key={`${question._id}-${optionIndex}`} className="option-item">
                      <input
                        type="radio"
                        name={question._id}
                        checked={selectedAnswers[question._id] === optionIndex}
                        disabled={timeUp}
                        onChange={() => handleOptionSelect(question._id, optionIndex)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button className="primary-btn" type="button" onClick={handleSubmitQuiz} disabled={timeUp}>
              Submit Quiz
            </button>
          </article>

          {result ? (
            <article className="card">
              <h3>Latest Result</h3>
              <p>
                <strong>Score:</strong> {result.score}/100
              </p>
              <p>
                <strong>Correct:</strong> {result.correctAnswers}/{result.totalQuestions}
              </p>
            </article>
          ) : null}

          <article className="card">
            <h3>Quiz History</h3>
            {history.length ? (
              <ul className="simple-list">
                {history.map((attempt) => (
                  <li key={attempt._id}>
                    Score {attempt.score}/100 ({attempt.correctAnswers}/{attempt.totalQuestions})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attempts yet.</p>
            )}
          </article>
        </>
      ) : null}
    </section>
  );
}

export default QuizPage;
