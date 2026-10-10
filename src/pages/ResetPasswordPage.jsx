import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(!token ? 'Reset token is missing from the URL link.' : '');

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing reset token. Please use the exact link sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await client.post('/api/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
      showToast(res.data.message || 'Password reset successfully!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Link may be expired or already used.');
      showToast('Password reset failed', 'error');
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
            <Lock size={28} />
          </div>
          <h1>Set New Password</h1>
          <p>Choose a secure password for your account</p>
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

        {success ? (
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
            <h2>Password Changed!</h2>
            <p style={{ margin: '12px 0 24px' }}>
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Sign In <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                    color: 'var(--text-muted)'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Password strength:</span>
                  <span style={{ fontWeight: '600', color: strength >= 3 ? 'var(--success)' : strength >= 2 ? 'var(--warning)' : 'var(--error)' }}>
                    {strength >= 3 ? 'Strong' : strength >= 2 ? 'Medium' : 'Weak'}
                  </span>
                </div>
                <div className="strength-meter">
                  <div className={`strength-bar ${strength >= 3 ? 'strength-strong' : strength >= 2 ? 'strength-medium' : 'strength-weak'}`} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '16px' }}
              disabled={loading || !token}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>

            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              Cancel and Return to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
