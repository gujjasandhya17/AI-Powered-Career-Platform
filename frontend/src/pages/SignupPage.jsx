import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function SignupPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.signup(formData);
      saveAuth({ token: response.token, user: response.user });
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Minimum 6 characters"
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
