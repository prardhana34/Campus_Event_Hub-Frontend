import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  BookmarkCheck, 
  Award, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Bell, 
  Search, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [regsRes, annRes] = await Promise.all([
        client.get('/api/registrations/me'),
        client.get('/api/announcements')
      ]);
      setRegistrations(regsRes.data);
      setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmedRegistrations = registrations.filter(r => r.status === 'CONFIRMED');
  const attendedRegistrations = registrations.filter(r => r.status === 'ATTENDED');
  const upcomingEvents = confirmedRegistrations.filter(r => new Date(r.eventStartDate) >= new Date());

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Student Portal
            </span>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>
              Welcome back, {user?.fullName}!
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              {user?.department} • {user?.rollNumber || 'Enrolled Student'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/events" className="btn btn-primary">
              <Search size={16} /> Browse Events
            </Link>
            <Link to="/my-registrations" className="btn btn-outline">
              My Registrations
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-3" style={{ marginBottom: '36px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'var(--pale-blue)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BookmarkCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                {registrations.length}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Total Registrations
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'var(--pale-lavender)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                {upcomingEvents.length}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Upcoming Events
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              backgroundColor: 'var(--pale-mint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                {attendedRegistrations.length}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Events Attended
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Upcoming Registered Events & Campus Announcements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Left Column: Upcoming Registered Events */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Upcoming Registered Events</h2>
              <Link to="/my-registrations" style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                View All
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
                <div className="spinner spinner-blue" style={{ width: '30px', height: '30px', margin: '0 auto 12px' }}></div>
                <p>Loading registrations...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Calendar size={28} /></div>
                <h3>No Upcoming Registrations</h3>
                <p style={{ marginBottom: '16px' }}>You have not registered for any upcoming events yet.</p>
                <Link to="/events" className="btn btn-primary btn-sm">
                  Explore Events Directory
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {upcomingEvents.slice(0, 4).map((reg) => (
                  <div key={reg.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span className="badge badge-primary">{reg.eventCategory}</span>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Confirmed
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                      <Link to={`/events/${reg.eventId}`} style={{ color: 'var(--text-main)' }}>
                        {reg.eventTitle}
                      </Link>
                    </h3>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--primary)" />
                        <span>{formatDate(reg.eventStartDate)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <span>{reg.eventVenue}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link to={`/events/${reg.eventId}`} className="btn btn-outline btn-sm">
                        View Event Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Campus Announcements */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Announcements</h2>
              <span className="badge badge-lavender"><Bell size={12} /> Live</span>
            </div>

            {announcements.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active announcements at this time.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="card" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                        {ann.category || 'General'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(ann.createdAt)}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                      {ann.title}
                    </h4>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
