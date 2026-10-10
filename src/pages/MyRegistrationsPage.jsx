import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import { 
  BookmarkCheck, 
  Calendar, 
  MapPin, 
  Clock, 
  X, 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const MyRegistrationsPage = () => {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Cancel modal
  const [cancellingReg, setCancellingReg] = useState(null);
  const [cancelReasonCategory, setCancelReasonCategory] = useState('Schedule Conflict');
  const [cancelReasonDetails, setCancelReasonDetails] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Feedback modal
  const [feedbackReg, setFeedbackReg] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/registrations/me');
      setRegistrations(res.data);
    } catch (err) {
      showToast('Failed to load your event registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!cancellingReg) return;

    const finalReason = cancelReasonDetails.trim()
      ? `${cancelReasonCategory}: ${cancelReasonDetails.trim()}`
      : cancelReasonCategory;

    try {
      setCancelLoading(true);
      await client.delete(`/api/registrations/${cancellingReg.id}`, {
        params: { reason: finalReason }
      });
      showToast('Registration cancelled. Your slot has been released.', 'success');
      setCancellingReg(null);
      fetchRegistrations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel registration', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackReg) return;

    try {
      setFeedbackLoading(true);
      await client.post(`/api/registrations/${feedbackReg.id}/feedback`, {
        rating,
        feedback: feedbackText,
      });
      showToast('Thank you! Your feedback has been recorded.', 'success');
      setFeedbackReg(null);
      fetchRegistrations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit feedback', 'error');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const now = new Date();
  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return reg.status === 'CONFIRMED' && new Date(reg.eventStartDate) >= now;
    }
    if (activeTab === 'past') {
      return reg.status === 'ATTENDED' || (reg.status === 'CONFIRMED' && new Date(reg.eventStartDate) < now);
    }
    if (activeTab === 'cancelled') {
      return reg.status === 'CANCELLED';
    }
    return true;
  });

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
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
            Participation
          </span>
          <h1>My Event Registrations</h1>
          <p>Review your registered workshops, hackathons, and check-in tickets</p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {[
            { id: 'all', label: 'All Registrations' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Completed / Attended' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--pale-blue)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? '600' : '500',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Registrations List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading your registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><BookmarkCheck size={32} /></div>
            <h3>No Registrations In This View</h3>
            <p style={{ marginBottom: '20px' }}>
              {activeTab === 'all'
                ? "You haven't registered for any campus events yet. Explore upcoming events now!"
                : `No ${activeTab} registrations found.`}
            </p>
            <Link to="/events" className="btn btn-primary">
              Browse College Events <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredRegistrations.map((reg) => {
              const isUpcoming = new Date(reg.eventStartDate) >= now;
              const canCancel = reg.status === 'CONFIRMED' && isUpcoming;

              return (
                <div key={reg.id} className="card" style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <span className="badge badge-primary">{reg.eventCategory}</span>

                    {reg.status === 'CONFIRMED' ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Confirmed Slot
                      </span>
                    ) : reg.status === 'ATTENDED' ? (
                      <span className="badge badge-lavender">
                        ★ Attended
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        Cancelled
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
                    <Link to={`/events/${reg.eventId}`} style={{ color: 'var(--text-main)' }}>
                      {reg.eventTitle}
                    </Link>
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="var(--primary)" />
                      <span>Starts: {formatDate(reg.eventStartDate)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--primary)" />
                      <span>Venue: {reg.eventVenue}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="var(--primary)" />
                      <span>Registered on: {formatDate(reg.registeredAt)}</span>
                    </div>
                  </div>

                  {/* Feedback summary if already provided */}
                  {reg.feedback && (
                    <div style={{
                      backgroundColor: 'var(--pale-blue)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '16px',
                      fontSize: '0.88rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontWeight: '600' }}>
                        <span>Your Rating: {reg.rating} / 5</span>
                        <Star size={14} fill="#B7791F" color="#B7791F" />
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>"{reg.feedback}"</div>
                    </div>
                  )}

                  {/* Cancellation Reason if cancelled */}
                  {reg.status === 'CANCELLED' && reg.cancellationReason && (
                    <div style={{
                      backgroundColor: '#FFF2F2',
                      border: '1px solid #FED7D7',
                      color: 'var(--error)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '16px',
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} />
                      <span><strong>Cancellation Reason:</strong> {reg.cancellationReason}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px'
                  }}>
                    <Link to={`/events/${reg.eventId}`} className="btn btn-outline btn-sm">
                      View Event Page
                    </Link>

                    {/* Feedback button for attended */}
                    {reg.status === 'ATTENDED' && !reg.feedback && (
                      <button
                        onClick={() => {
                          setFeedbackReg(reg);
                          setRating(5);
                          setFeedbackText('');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <MessageSquare size={14} /> Leave Feedback
                      </button>
                    )}

                    {/* Cancel action */}
                    {canCancel && (
                      <button
                        onClick={() => {
                          setCancellingReg(reg);
                          setCancelReasonCategory('Schedule Conflict');
                          setCancelReasonDetails('');
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingReg && (
          <div className="modal-overlay" onClick={() => setCancellingReg(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <div className="modal-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
                  <AlertTriangle size={20} /> Cancel Event Registration
                </h3>
                <button onClick={() => setCancellingReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCancelRegistration}>
                <p style={{ marginBottom: '16px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                  You are cancelling your registration for <strong>{cancellingReg.eventTitle}</strong>. 
                  Your seat will be released and made available for other students.
                </p>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="cancelReasonCategory">
                    Reason for Cancellation <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <select
                    id="cancelReasonCategory"
                    className="form-select"
                    value={cancelReasonCategory}
                    onChange={(e) => setCancelReasonCategory(e.target.value)}
                    required
                  >
                    <option value="Schedule Conflict">Schedule / Time Conflict</option>
                    <option value="Academic Class / Exam Commitment">Academic Class / Exam Commitment</option>
                    <option value="Medical / Personal Emergency">Medical / Personal Emergency</option>
                    <option value="Transportation / Travel Issue">Transportation / Travel Issue</option>
                    <option value="Change of Plans">Change of Plans / No Longer Interested</option>
                    <option value="Other Reason">Other Reason</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="cancelReasonDetails">
                    Additional Details / Explanation (Optional)
                  </label>
                  <textarea
                    id="cancelReasonDetails"
                    className="form-textarea"
                    rows="3"
                    placeholder="Provide any additional explanation for the event organizers..."
                    value={cancelReasonDetails}
                    onChange={(e) => setCancelReasonDetails(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setCancellingReg(null)} className="btn btn-outline" disabled={cancelLoading}>
                    Keep Registration
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={cancelLoading}>
                    {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackReg && (
          <div className="modal-overlay" onClick={() => setFeedbackReg(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Share Your Event Feedback</h3>
                <button onClick={() => setFeedbackReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitFeedback}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Event: <strong>{feedbackReg.eventTitle}</strong>
                </p>

                <div className="form-group">
                  <label className="form-label">Rating (1 to 5 Stars)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Star
                          size={28}
                          color={star <= rating ? '#B7791F' : '#CBD5E1'}
                          fill={star <= rating ? '#B7791F' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="feedbackText">Comments & Suggestions</label>
                  <textarea
                    id="feedbackText"
                    className="form-textarea"
                    rows="4"
                    placeholder="Tell us what you learned or how the event can be improved..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setFeedbackReg(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={feedbackLoading}>
                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
