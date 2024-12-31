import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
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
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-header">Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label className="signup-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div>
          <label className="signup-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <div>
          <label className="signup-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
        </div>
        <button
          type="submit"
          className="signup-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Signup'}
        </button>
        {/* Add a link for existing users */}
        <div className="login-link-container">
          <p className="login-text">
            Already have an account?{' '}
            <Link to="/" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
      