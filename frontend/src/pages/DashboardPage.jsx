import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function DashboardPage() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.getDashboard(token);
        setDashboard(response.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const resumeScore = dashboard?.resumeAnalysis?.score || 0;
  const quizHistory = dashboard?.quizHistory || [];
  const averageQuizScore = quizHistory.length
    ? Math.round(quizHistory.reduce((sum, attempt) => sum + attempt.score, 0) / quizHistory.length)
    : 0;

  const recentActivity = [
    ...(dashboard?.resumeAnalysis
      ? [
          {
            type: 'Resume Uploaded',
            detail: `Scored ${dashboard.resumeAnalysis.score}/100`,
            time: dashboard.resumeAnalysis.createdAt,
          },
        ]
      : []),
    ...quizHistory.slice(0, 4).map((attempt) => ({
      type: 'Quiz Attempt',
      detail: `Score ${attempt.score}/100 (${attempt.correctAnswers}/${attempt.totalQuestions})`,
      time: attempt.createdAt,
    })),
  ].slice(0, 5);

  return (
    <section className="dashboard-page">
      <h2>Dashboard</h2>
      <p className="muted">Track profile details, resume quality, quiz performance, and recent activity.</p>

      {loading ? <p>Loading dashboard...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error ? (
        <div className="dashboard-grid">
          <article className="card dashboard-profile-card">
            <h3>User Profile</h3>
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Status:</strong> Active Learner
            </p>
          </article>

          <article className="card">
            <h3>Resume Score</h3>
            {dashboard?.resumeAnalysis ? (
              <>
                <div className="progress-track" role="img" aria-label={`Resume score ${resumeScore} out of 100`}>
                  <div className="progress-fill" style={{ width: `${resumeScore}%` }} />
                </div>
                <p className="metric-value">{resumeScore}/100</p>
                <p className="muted">Matched skills: {dashboard.resumeAnalysis.matchedSkills?.length || 0}</p>
              </>
            ) : (
              <p>No resume analysis found yet.</p>
            )}
          </article>

          <article className="card">
            <h3>Quiz Performance</h3>
            {quizHistory.length ? (
              <>
                <p className="metric-value">Avg {averageQuizScore}/100</p>
                <div className="mini-chart">
                  {quizHistory.slice(0, 5).map((attempt) => (
                    <div className="mini-bar-row" key={attempt._id}>
                      <span>Attempt</span>
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${attempt.score}%` }} />
                      </div>
                      <strong>{attempt.score}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No quiz attempts found yet.</p>
            )}
          </article>

          <article className="card activity-card">
            <h3>Recent Activity</h3>
            {recentActivity.length ? (
              <ul className="activity-list">
                {recentActivity.map((activity, index) => (
                  <li key={`${activity.type}-${index}`}>
                    <div>
                      <strong>{activity.type}</strong>
                      <p>{activity.detail}</p>
                    </div>
                    <span>{new Date(activity.time).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activity yet.</p>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default DashboardPage;
