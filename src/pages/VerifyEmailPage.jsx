import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { showToast } = useToast();

  const [loading, setLoading] = useState(!!token);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        setLoading(true);
        const res = await client.post('/api/auth/verify-email', { token });
        setSuccess(true);
        setMessage(res.data.message || 'Email verified successfully!');
        showToast('Email verified successfully!', 'success');
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Verification token is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, showToast]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    try {
      setResendLoading(true);
      const res = await client.post('/api/auth/resend-verification', { email: resendEmail.trim() });
      setResendSuccess(true);
      showToast(res.data.message, 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resend verification email', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {loading ? (
          <div>
            <div className="spinner spinner-blue" style={{ width: '48px', height: '48px', margin: '0 auto 20px' }}></div>
            <h2>Verifying Your Email...</h2>
            <p>Please wait while we confirm your student account credentials.</p>
          </div>
        ) : success ? (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--pale-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2>Verification Successful!</h2>
            <p style={{ margin: '14px 0 28px' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Login <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <AlertCircle size={36} />
            </div>
            <h2>Email Verification</h2>
            <p style={{ margin: '12px 0 24px' }}>
              {token ? message : 'Enter your registered email address to receive a new verification link.'}
            </p>

            {resendSuccess ? (
              <div style={{
                backgroundColor: 'var(--pale-mint)',
                color: 'var(--success)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px'
              }}>
                If the email is unverified, a new link has been dispatched. Check your inbox!
              </div>
            ) : (
              <form onSubmit={handleResend} style={{ textAlign: 'left' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="resendEmail">Your Campus Email</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="resendEmail"
                      type="email"
                      className="form-input"
                      placeholder="student@campus.edu"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '16px' }}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Link'}
                </button>
              </form>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
