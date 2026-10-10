import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  UserX, 
  Mail, 
  BookmarkCheck 
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';

export const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      showToast('Failed to load students directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.enabled;
    try {
      await client.patch(`/api/admin/users/${user.id}/status`, {
        enabled: newStatus,
      });
      showToast(`Account status updated for ${user.fullName}`, 'success');
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, enabled: newStatus } : u));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update account status', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <AdminNav 
        title="Student Directory & Accounts" 
        subtitle="Inspect student credentials, department enrollments, and toggle account access"
      />
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Search */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, roll number, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Student Data Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading students directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={32} /></div>
            <h3>No Students Found</h3>
            <p>No registered student accounts matched your query.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Campus Email</th>
                  <th>Roll / Department</th>
                  <th>Year & Sec</th>
                  <th>Email Verified</th>
                  <th>Registrations</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{student.fullName}</div>
                    </td>

                    <td style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {student.email}
                    </td>

                    <td>
                      <div style={{ fontWeight: '600' }}>{student.rollNumber || 'N/A'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.department || 'General'}</div>
                    </td>

                    <td style={{ fontSize: '0.86rem' }}>
                      {student.year || 'N/A'} {student.section ? `(${student.section})` : ''}
                    </td>

                    <td>
                      {student.emailVerified ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <AlertCircle size={12} /> Pending
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="badge badge-primary">
                        <BookmarkCheck size={12} /> {student.totalRegistrations || 0}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${student.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {student.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`btn btn-sm ${student.enabled ? 'btn-danger' : 'btn-secondary'}`}
                        title={student.enabled ? 'Disable student access' : 'Enable student access'}
                      >
                        {student.enabled ? (
                          <>
                            <UserX size={14} /> Disable
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} /> Enable
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
