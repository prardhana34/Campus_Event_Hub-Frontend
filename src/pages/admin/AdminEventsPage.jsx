import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';

export const AdminEventsPage = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshops',
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    organizer: '',
    capacity: 100,
    imageUrl: '',
    status: 'PUBLISHED',
  });

  // Delete modal
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/events');
      setEvents(res.data);
    } catch (err) {
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    const now = new Date();
    const defaultStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const defaultEnd = new Date(defaultStart.getTime() + 6 * 60 * 60 * 1000);
    const defaultDeadline = new Date(defaultStart.getTime() - 24 * 60 * 60 * 1000);

    const toInputString = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormData({
      title: '',
      description: '',
      category: 'Workshops',
      venue: '',
      startDate: toInputString(defaultStart),
      endDate: toInputString(defaultEnd),
      registrationDeadline: toInputString(defaultDeadline),
      organizer: 'Department of Computer Science',
      capacity: 100,
      imageUrl: '',
      status: 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    const toInputString = (str) => {
      if (!str) return '';
      const d = new Date(str);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      startDate: toInputString(event.startDate),
      endDate: toInputString(event.endDate),
      registrationDeadline: toInputString(event.registrationDeadline),
      organizer: event.organizer,
      capacity: event.capacity,
      imageUrl: event.imageUrl || '',
      status: event.status,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      showToast('Event end time must be after start time', 'error');
      return;
    }

    try {
      setModalLoading(true);
      if (editingEvent) {
        await client.put(`/api/events/${editingEvent.id}`, formData);
        showToast('Event updated successfully!', 'success');
      } else {
        await client.post('/api/events', formData);
        showToast('Event created successfully!', 'success');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save event', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventTarget) return;

    try {
      setDeleteLoading(true);
      await client.delete(`/api/events/${deleteEventTarget.id}`);
      showToast('Event processed successfully', 'success');
      setDeleteEventTarget(null);
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete event', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (statusFilter && e.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <AdminNav 
        title="Manage Campus Events" 
        subtitle="Publish, configure, edit schedules, and inspect registration counts"
        actionButton={
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> Create New Event
          </button>
        }
      />
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Filter Bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search events by title, venue, organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ width: '200px' }}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table of Events */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading events table...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={32} /></div>
            <h3>No Events Found</h3>
            <p>No events match your current filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Title & Category</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Registered / Cap</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '0.98rem' }}>{evt.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {evt.category} • Org: {evt.organizer}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {formatDate(evt.startDate)}
                    </td>

                    <td style={{ fontSize: '0.88rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {evt.venue}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600' }}>{evt.registeredCount || 0} / {evt.capacity}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${
                        evt.status === 'PUBLISHED' ? 'badge-success' :
                        evt.status === 'CANCELLED' ? 'badge-danger' :
                        evt.status === 'DRAFT' ? 'badge-warning' : 'badge-lavender'
                      }`}>
                        {evt.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <Link
                          to={`/admin/registrations?eventId=${evt.id}`}
                          className="btn btn-outline btn-sm"
                          title="View Registered Students"
                        >
                          <Users size={14} />
                          <span>Participants</span>
                        </Link>

                        <button
                          onClick={() => openEditModal(evt)}
                          className="btn btn-outline btn-sm"
                          title="Edit Event"
                        >
                          <Edit size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteEventTarget(evt)}
                          className="btn btn-danger btn-sm"
                          title="Delete / Cancel Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingEvent ? 'Edit Event Details' : 'Create New Campus Event'}</h3>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Event Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Annual Autonomous Drone Racing"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Event Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-textarea"
                    rows="4"
                    placeholder="Provide full schedule, guidelines, and prerequisite requirements..."
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Workshops">Workshops</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Technical Fests">Technical Fests</option>
                      <option value="Club Events">Club Events</option>
                      <option value="Seminars">Seminars</option>
                      <option value="Competitions">Competitions</option>
                      <option value="Cultural Fests">Cultural Fests</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="venue">Venue / Location *</label>
                    <input
                      id="venue"
                      name="venue"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Main Auditorium, Block C"
                      value={formData.venue}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="organizer">Organizer *</label>
                    <input
                      id="organizer"
                      name="organizer"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Robotics Club"
                      value={formData.organizer}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="capacity">Capacity (Slots) *</label>
                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      className="form-input"
                      value={formData.capacity}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startDate">Start Date & Time *</label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      className="form-input"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="endDate">End Date & Time *</label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      className="form-input"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="registrationDeadline">Registration Deadline *</label>
                    <input
                      id="registrationDeadline"
                      name="registrationDeadline"
                      type="datetime-local"
                      className="form-input"
                      value={formData.registrationDeadline}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleFormChange}
                    >
                      <option value="PUBLISHED">Published (Open for Registration)</option>
                      <option value="DRAFT">Draft (Hidden)</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="imageUrl">Banner Image URL</label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" disabled={modalLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                    {modalLoading ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete / Cancel Event Modal */}
        {deleteEventTarget && (
          <div className="modal-overlay" onClick={() => setDeleteEventTarget(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
                  <AlertTriangle size={20} /> Delete or Cancel Event
                </h3>
                <button onClick={() => setDeleteEventTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                Are you sure you want to delete or cancel <strong>{deleteEventTarget.title}</strong>? If attendees are already registered, the event status will safely transition to <strong>CANCELLED</strong> without dropping attendee audit records.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setDeleteEventTarget(null)} className="btn btn-outline" disabled={deleteLoading}>
                  Back
                </button>
                <button onClick={handleDeleteEvent} className="btn btn-danger" disabled={deleteLoading}>
                  {deleteLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
