import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import { KeyRound, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await client.post('/api/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
      setMessage(res.data.message || 'If an account exists with that email, reset instructions have been sent.');
      showToast('Password reset instructions requested.', 'info');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
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
            <KeyRound size={28} />
          </div>
          <h1>Forgot Password</h1>
          <p>We'll send you instructions to recover your account</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {submitted ? (
          <div>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--pale-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ marginBottom: '10px' }}>Check Your Email</h3>
            <p style={{ fontSize: '0.92rem', marginBottom: '28px', lineHeight: '1.5' }}>
              {message}
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Registered Email Address</label>
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
                />
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>

            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
