import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ResumePage() {
  const { token } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const setFileFromEvent = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setResumeFile(selectedFile);
    if (selectedFile) {
      setResumeText('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0] || null;
    setResumeFile(droppedFile);
    if (droppedFile) {
      setResumeText('');
    }
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = resumeFile
        ? await api.analyzeResumeByFile(token, resumeFile)
        : await api.analyzeResumeByText(token, resumeText);

      setResult(response.analysis);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="resume-page">
      <h2>Resume Analyzer</h2>
      <p className="muted">Upload, drag-drop, or paste your resume to get structured AI-driven feedback.</p>

      <form className="card form-card" onSubmit={handleAnalyze}>
        <label>Upload Resume (PDF/TXT)</label>
        <label
          className={isDragging ? 'drop-zone active' : 'drop-zone'}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept=".pdf,.txt" onChange={setFileFromEvent} />
          <p>{resumeFile ? `Selected: ${resumeFile.name}` : 'Drag & drop your resume here or click to browse'}</p>
        </label>

        <p className="muted center">OR</p>

        <label>Paste Resume Text</label>
        <textarea
          rows={8}
          value={resumeText}
          onChange={(event) => {
            setResumeText(event.target.value);
            if (event.target.value.trim()) {
              setResumeFile(null);
            }
          }}
          placeholder="Paste your resume text here..."
        />

        {loading ? <p className="loading-text">Analyzing resume, please wait...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>

      {result ? (
        <article className="card resume-result-card fade-in">
          <h3>Analysis Result</h3>
          <div className="resume-score-wrap">
            <div
              className="score-ring"
              style={{ '--score-percent': `${result.score}` }}
              role="img"
              aria-label={`Resume score ${result.score} out of 100`}
            >
              <span>{result.score}</span>
            </div>
            <p className="muted">Resume Score</p>
          </div>

          <div className="resume-tags-wrap">
            <h4>Detected Skills</h4>
            <div className="tag-list">
              {result.matchedSkills.length ? (
                result.matchedSkills.map((skill) => (
                  <span className="tag positive" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="muted">No skills detected</span>
              )}
            </div>
          </div>

          <div className="resume-tags-wrap">
            <h4>Missing Skills</h4>
            <div className="tag-list">
              {result.missingSkills.length ? (
                result.missingSkills.map((skill) => (
                  <span className="tag negative" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="muted">No missing skills detected</span>
              )}
            </div>
          </div>

          <h4>Suggestions</h4>
          <div className="suggestion-list">
            {result.suggestions.map((item) => (
              <article className="suggestion-card" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  );
}

export default ResumePage;
