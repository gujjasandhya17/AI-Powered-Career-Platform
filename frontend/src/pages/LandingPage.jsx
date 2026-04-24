import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Resume Analyzer',
    description: 'Upload your resume and get an instant score, skill gap detection, and improvement suggestions.',
  },
  {
    title: 'Mock Tests',
    description: 'Practice curated MCQ quizzes with timer support and score tracking to improve interview readiness.',
  },
  {
    title: 'Smart Dashboard',
    description: 'See all your progress in one place with resume performance and quiz activity insights.',
  },
];

const stats = [
  { label: 'Resume Analyses', value: '1K+' },
  { label: 'Mock Tests Taken', value: '2.5K+' },
  { label: 'Avg Score Improvement', value: '37%' },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>AI - Powered Career Platform</h1>
        <nav className="landing-nav">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="nav-signup-btn">
            Sign Up
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-badge">AI-Powered Career Preparation</p>
          <h2>Build a stronger resume and crack technical interviews with confidence.</h2>
          <p>
            Analyze your resume, practice timed quizzes, and track your progress with a clean, interactive experience.
          </p>
          <div className="hero-actions">
            <Link to="/resume" className="primary-btn hero-btn">
              Upload Resume
            </Link>
            <Link to="/dashboard" className="secondary-btn hero-btn-secondary">
              Go to Dashboard
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((item) => (
              <article className="hero-stat-card" key={item.label}>
                <h4>{item.value}</h4>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-visual-panel" aria-hidden="true">
          <div className="visual-card glass-card floating-card one">
            <div className="visual-card-header">
              <span className="dot pulse" />
              <span>Resume Score</span>
            </div>
            <div className="visual-ring">84</div>
          </div>

          <div className="visual-card glass-card floating-card two">
            <p>Detected Skills</p>
            <div className="tag-list compact">
              <span className="tag positive">React</span>
              <span className="tag positive">Node.js</span>
              <span className="tag positive">MongoDB</span>
            </div>
          </div>

          <div className="visual-card glass-card floating-card three">
            <p>Quiz Progress</p>
            <div className="visual-mini-bar">
              <span />
            </div>
            <small>12/15 completed</small>
          </div>

          <div className="hero-glow" aria-hidden="true" />
        </div>
      </section>

      <section className="features-section">
        <h3>Key Features</h3>
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
