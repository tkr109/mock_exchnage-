import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './Login.css'; // Import CSS file for styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token); // Save token to localStorage
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-header">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label className="login-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div>
          <label className="login-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        {/* Add a link for new users */}
        <div className="signup-link-container">
          <p className="signup-text">
            New User?{' '}
            <Link to="/signup" className="signup-link">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
          