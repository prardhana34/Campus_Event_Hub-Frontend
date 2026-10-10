import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isStudent, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await client.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Event not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isAdmin) {
      showToast('Administrators cannot register for events as participants', 'info');
      return;
    }

    try {
      setRegistering(true);
      await client.post(`/api/events/${id}/registrations`);
      showToast('Registration confirmed! You have successfully registered.', 'success');
      // Refresh event details
      fetchEventDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register for event';
      showToast(msg, 'error');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="spinner spinner-blue" style={{ width: '44px', height: '44px', margin: '0 auto 16px' }}></div>
        <p>Loading event information...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon"><AlertCircle size={32} /></div>
          <h2>Event Not Found</h2>
          <p>{error || "The requested event could not be located."}</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Back to Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100));
  const seatsLeft = Math.max(0, event.capacity - (event.registeredCount || 0));

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <Link 
          to="/events" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            marginBottom: '24px' 
          }}
        >
          <ArrowLeft size={18} /> Back to all events
        </Link>

        {/* Top Hero Banner */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--pale-blue)',
          height: '340px',
          backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '36px',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(37, 50, 74, 0.2) 0%, rgba(37, 50, 74, 0.75) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '36px'
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary)' }}>
                <Tag size={12} /> {event.category}
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'var(--text-main)' }}>
                {event.status}
              </span>
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', maxWidth: '850px' }}>
              {event.title}
            </h1>
          </div>
        </div>

        {/* 2-Column Details Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Main Info Column */}
          <div>
            <div className="card" style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>About This Event</h2>
              <div style={{
                color: 'var(--text-main)',
                lineHeight: '1.8',
                fontSize: '1rem',
                whiteSpace: 'pre-line'
              }}>
                {event.description}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Event Organization & Venue</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--pale-blue)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>Location / Venue</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{event.venue}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--pale-lavender)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>Organized By</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{event.organizer}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration & Schedule Card Column */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Schedule & Registration</h3>

              {/* Date & Time details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Starts At
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {formatDate(event.startDate)}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Concludes At
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {formatDate(event.endDate)}
                  </div>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'var(--pale-blue)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--primary)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '2px' }}>
                    Registration Deadline
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {formatDate(event.registrationDeadline)}
                  </div>
                </div>
              </div>

              {/* Capacity Progress */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Capacity Status</span>
                  <span style={{ fontWeight: '700', color: seatsLeft <= 10 ? 'var(--error)' : 'var(--text-main)' }}>
                    {seatsLeft} slots left ({event.registeredCount || 0} / {event.capacity})
                  </span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${capacityPercent}%`,
                    backgroundColor: capacityPercent >= 90 ? 'var(--error)' : 'var(--primary)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Action Button Area */}
              {event.isRegistered ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: 'var(--pale-mint)',
                    color: 'var(--success)',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <CheckCircle2 size={20} />
                    <span>You Are Registered!</span>
                  </div>
                  <Link to="/my-registrations" className="btn btn-outline" style={{ width: '100%' }}>
                    Manage in My Registrations
                  </Link>
                </div>
              ) : event.status === 'CANCELLED' ? (
                <button disabled className="btn btn-danger" style={{ width: '100%' }}>
                  Event Cancelled
                </button>
              ) : event.isRegistrationClosed ? (
                <button disabled className="btn btn-outline" style={{ width: '100%' }}>
                  Registration Closed
                </button>
              ) : event.isFull ? (
                <button disabled className="btn btn-outline" style={{ width: '100%' }}>
                  Event Full
                </button>
              ) : !isAuthenticated ? (
                <div>
                  <button
                    onClick={handleRegister}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: '10px' }}
                  >
                    Log In to Register
                  </button>
                  <p style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Student credentials required to register
                  </p>
                </div>
              ) : isAdmin ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <Link to={`/admin/events`} className="btn btn-secondary" style={{ width: '100%' }}>
                    Manage in Admin Panel
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                  disabled={registering}
                >
                  {registering ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="spinner"></span> Confirming Slot...
                    </span>
                  ) : (
                    <span>Register for Event</span>
                  )}
                </button>
              )}
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
