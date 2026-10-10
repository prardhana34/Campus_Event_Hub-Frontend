import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  Eye, 
  EyeOff,
  Calendar
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('details');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: '',
    year: '',
    section: '',
    role: '',
    emailVerified: false,
    createdAt: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await client.get('/api/users/profile');
      setProfileData(res.data);
      updateUser(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await client.put('/api/users/profile', {
        fullName: profileData.fullName,
        rollNumber: profileData.rollNumber,
        department: profileData.department,
        year: profileData.year,
        section: profileData.section,
      });
      setProfileData(res.data);
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await client.post('/api/auth/change-password', passwordData);
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password. Verify your current password.';
      setPasswordError(msg);
      showToast(msg, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Account Settings
          </span>
          <h1>My Profile</h1>
          <p>Manage your account personal information, security credentials, and department records</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'details' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'details' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <User size={18} /> Personal Information
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'security' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'security' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <KeyRound size={18} /> Password & Security
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'details' && (
          <div className="card" style={{ padding: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--pale-blue)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: '700'
              }}>
                {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{profileData.fullName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`badge ${profileData.role === 'ROLE_ADMIN' ? 'badge-lavender' : 'badge-primary'}`}>
                    {profileData.role === 'ROLE_ADMIN' ? 'ADMINISTRATOR' : 'STUDENT'}
                  </span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Active Account
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  value={profileData.fullName || ''}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address (Managed by Institution)</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={profileData.email || ''}
                  disabled
                  style={{ backgroundColor: '#F1F5F9', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Email addresses are permanently bound to student roll records
                </span>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="rollNumber">Roll / Student ID</label>
                  <input
                    id="rollNumber"
                    name="rollNumber"
                    type="text"
                    className="form-input"
                    value={profileData.rollNumber || ''}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department / Course</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    className="form-input"
                    value={profileData.department || ''}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="year">Academic Year</label>
                  <select
                    id="year"
                    name="year"
                    className="form-select"
                    value={profileData.year || ''}
                    onChange={handleProfileChange}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="section">Section</label>
                  <input
                    id="section"
                    name="section"
                    type="text"
                    className="form-input"
                    value={profileData.section || ''}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={profileLoading}
                >
                  <Save size={16} />
                  <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'security' && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Update Password</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
              Ensure your account uses a secure password with at least 6 characters.
            </p>

            {passwordError && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: 'var(--error)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '0.88rem'
              }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="currentPassword"
                    type={showCurrentPass ? 'text' : 'password'}
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newPassword"
                    type={showNewPass ? 'text' : 'password'}
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type={showNewPass ? 'text' : 'password'}
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  <Lock size={16} />
                  <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
