import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  BookmarkCheck, 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  User, 
  Star 
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';

export const AdminRegistrationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');
  const { showToast } = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || '');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedEventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        client.get('/api/events'),
        selectedEventId 
          ? client.get(`/api/admin/events/${selectedEventId}/registrations`)
          : client.get('/api/admin/registrations')
      ]);

      setEvents(eventsRes.data);
      setRegistrations(regsRes.data);
    } catch (err) {
      showToast('Failed to load registration records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = async (reg) => {
    if (reg.status === 'CANCELLED') {
      showToast('Cannot mark attendance for a cancelled registration', 'error');
      return;
    }

    try {
      const newAttendance = !reg.attendanceMarked;
      await client.patch(`/api/admin/registrations/${reg.id}/attendance`, {
        attended: newAttendance,
      });
      showToast(`Attendance updated for ${reg.studentName}`, 'success');
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, attendanceMarked: newAttendance, status: newAttendance ? 'ATTENDED' : 'CONFIRMED' } : r));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update attendance';
      showToast(errorMsg, 'error');
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No registrations to export', 'info');
      return;
    }

    const headers = [
      'Registration ID',
      'Event Title',
      'Event Category',
      'Student Name',
      'Email',
      'Roll Number',
      'Department',
      'Registered At',
      'Status',
      'Attended',
      'Cancellation Reason',
      'Cancelled At',
      'Rating',
      'Feedback'
    ];

    const rows = filteredRegistrations.map(r => [
      r.id,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      r.eventCategory,
      `"${r.studentName.replace(/"/g, '""')}"`,
      r.studentEmail,
      r.studentRollNumber || 'N/A',
      r.studentDepartment || 'N/A',
      new Date(r.registeredAt).toLocaleString(),
      r.status,
      r.attendanceMarked ? 'Yes' : 'No',
      `"${(r.cancellationReason || '').replace(/"/g, '""')}"`,
      r.cancelledAt ? new Date(r.cancelledAt).toLocaleString() : 'N/A',
      r.rating || '',
      `"${(r.feedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campus_event_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported registrations to CSV', 'success');
  };

  const filteredRegistrations = registrations.filter(r => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.studentEmail.toLowerCase().includes(q) ||
      (r.studentRollNumber && r.studentRollNumber.toLowerCase().includes(q)) ||
      r.eventTitle.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <AdminNav 
        title="Event Participants & Attendance" 
        subtitle="Track student registrations, check-in attendance, and export reports"
        actionButton={
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm" disabled={filteredRegistrations.length === 0}>
            <Download size={15} /> Export to CSV
          </button>
        }
      />
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Filters */}
        <div className="card" style={{ padding: '20px', marginBottom: '28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by student name, roll no, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div>
              <select
                className="form-select"
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  if (e.target.value) setSearchParams({ eventId: e.target.value });
                  else setSearchParams({});
                }}
              >
                <option value="">All Events</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.registeredCount}/{evt.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed Slots</option>
                <option value="ATTENDED">Attended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Data Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading participants list...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><BookmarkCheck size={32} /></div>
            <h3>No Participants Found</h3>
            <p>There are no registration records matching your filter parameters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Information</th>
                  <th>Registered Event</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{reg.studentName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{reg.studentEmail}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Roll: {reg.studentRollNumber || 'N/A'} • Dept: {reg.studentDepartment || 'N/A'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {reg.eventTitle}
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                        {reg.eventCategory}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
                            marginTop: '6px', 
                            fontSize: '0.76rem', 
                            color: '#C53030', 
                            backgroundColor: '#FFF5F5',
                            border: '1px solid #FED7D7',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            maxWidth: '220px',
                            wordBreak: 'break-word',
                            lineHeight: 1.3
                          }}
                          title={`Cancellation reason: ${reg.cancellationReason}`}
                        >
                          <strong>Reason:</strong> {reg.cancellationReason}
                        </div>
                      )}
                    </td>

                    <td>
                      {reg.status === 'CANCELLED' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#A0AEC0',
                            backgroundColor: '#EDF2F7',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'not-allowed'
                          }}
                          title="Attendance cannot be given because the student cancelled this event registration"
                        >
                          <XCircle size={15} style={{ color: '#E53E3E' }} /> Not Eligible (Cancelled)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleAttendance(reg)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: reg.attendanceMarked ? 'var(--success)' : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}
                          title="Click to toggle attendance check-in"
                        >
                          {reg.attendanceMarked ? (
                            <>
                              <CheckCircle size={18} /> Checked In
                            </>
                          ) : (
                            <>
                              <XCircle size={18} /> Not Marked
                            </>
                          )}
                        </button>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {reg.feedback && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--warning)', fontWeight: '600' }} title={reg.feedback}>
                          <Star size={14} fill="#B7791F" /> {reg.rating}/5
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
    </div>
  );
};
