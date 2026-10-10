import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');

      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo and header */}
        <div className="auth-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: 'var(--pale-blue)',
            color: 'var(--primary)',
            marginBottom: '16px',
            border: '1px solid #D7E5FE'
          }}>
            <Calendar size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Campus Event Hub account</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            textAlign: 'left',
            border: '1px solid #FED7D7'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Campus Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
                autoComplete="email"
              />
              <Mail 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                autoComplete="current-password"
              />
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', textAlign: 'left' }}>
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Remember me on this device
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner"></span> Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Sign In to Portal <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: '600' }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};
