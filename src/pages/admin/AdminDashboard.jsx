import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Calendar, 
  BookmarkCheck, 
  Bell, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Layers,
  Sparkles
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';

export const AdminDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      showToast('Failed to load administrator statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
        <p>Loading administrator analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <AdminNav 
        title="Administrator Dashboard" 
        subtitle="Real-time campus metrics, event registries, and student participation" 
      />
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* 4 Metrics Cards */}
        <div className="grid-4" style={{ marginBottom: '36px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--pale-blue)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1' }}>
                {stats?.totalStudents || 0}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enrolled Students
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--pale-lavender)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1' }}>
                {stats?.totalEvents || 0}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Total Events
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--pale-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BookmarkCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1' }}>
                {stats?.totalRegistrations || 0}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Total Registrations
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1' }}>
                {stats?.activeAnnouncements || 0}
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Active Notices
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Recent Registrations & Categories Distribution */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Recent Registrations Table */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Recent Registrations Feed</h3>
              <Link to="/admin/registrations" style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                View All
              </Link>
            </div>

            {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                No student registrations recorded yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Event</th>
                      <th>Registered</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{reg.studentName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{reg.studentRollNumber || reg.studentEmail}</div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {reg.eventTitle}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {formatDate(reg.registeredAt)}
                        </td>
                        <td>
                          <span className={`badge ${
                            reg.status === 'CONFIRMED' ? 'badge-success' : 
                            reg.status === 'ATTENDED' ? 'badge-lavender' : 'badge-danger'
                          }`}>
                            {reg.status}
                          </span>
                          {reg.status === 'CANCELLED' && reg.cancellationReason && (
                            <div 
                              style={{ 
                                marginTop: '4px', 
                                fontSize: '0.72rem', 
                                color: 'var(--error)', 
                                maxWidth: '160px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`Reason: ${reg.cancellationReason}`}
                            >
                              {reg.cancellationReason}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Categories Breakdown & Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary)" />
                <span>Events by Track</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(stats?.eventsByCategory || {}).map(([cat, count]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>{cat}</span>
                    <span className="badge badge-primary">{count} events</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Management Shortcuts */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quick Operations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/admin/events" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <Calendar size={16} /> Event Management Directory
                </Link>
                <Link to="/admin/registrations" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <BookmarkCheck size={16} /> Attendance & Participant Lists
                </Link>
                <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <Users size={16} /> Manage Student Directory
                </Link>
                <Link to="/admin/announcements" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                  <Bell size={16} /> Campus Announcements Board
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
