import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Eye, EyeOff, Lock, Mail, User, BookOpen, Check, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    section: 'A',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Campus email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Please provide a valid email format';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must accept the terms and campus event guidelines';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await register(formData);
      setSuccessMessage(res.message || 'Registration successful! You may now sign in.');
      showToast(res.message || 'Registration successful!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors) {
        setFieldErrors(resp.errors);
      }
      const msg = resp?.message || 'Registration failed. Please check the provided information.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '580px' }}>
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
          <h1>Student Registration</h1>
          <p>Create your student account to register for campus events</p>
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

        {successMessage && (
          <div style={{
            backgroundColor: 'var(--pale-mint)',
            color: 'var(--success)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '20px',
            textAlign: 'left',
            border: '1px solid #C6F0DF',
            fontWeight: '500'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
              />
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {fieldErrors.fullName && <span className="form-error">{fieldErrors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">College Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="student@campus.edu"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
          </div>

          {/* Roll Number and Department */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="rollNumber">Roll / Student ID</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                className="form-input"
                placeholder="e.g. 21CS042"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">Department / Branch</label>
              <select
                id="department"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Management Studies (MBA)">Management Studies (MBA)</option>
                <option value="Applied Sciences">Applied Sciences</option>
              </select>
            </div>
          </div>

          {/* Year and Section */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="year">Academic Year</label>
              <select
                id="year"
                name="year"
                className="form-select"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="section">Section</label>
              <input
                id="section"
                name="section"
                type="text"
                className="form-input"
                placeholder="e.g. A"
                value={formData.section}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '38px', paddingRight: '36px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              {fieldErrors.confirmPassword && <span className="form-error">{fieldErrors.confirmPassword}</span>}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div style={{ textAlign: 'left', marginBottom: '18px' }}>
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

          {/* Terms checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px', textAlign: 'left' }}>
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', marginTop: '3px', width: '16px', height: '16px' }}
            />
            <label htmlFor="agreeTerms" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
              I agree to the University Event Terms and acknowledge that registration creates a Student role account.
            </label>
          </div>
          {fieldErrors.agreeTerms && <div className="form-error" style={{ textAlign: 'left', marginTop: '-16px', marginBottom: '16px' }}>{fieldErrors.agreeTerms}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner"></span> Creating Account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Create Student Account <ArrowRight size={18} />
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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '600' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
