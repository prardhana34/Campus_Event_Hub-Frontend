import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const BrowseEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('dateAsc');

  useEffect(() => {
    fetchEventsAndCategories();
  }, [selectedCategory]);

  const fetchEventsAndCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const [eventsRes, catsRes] = await Promise.all([
        client.get('/api/events', { params }),
        client.get('/api/events/categories')
      ]);

      setEvents(eventsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      setError('Failed to fetch events from backend. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const filteredEvents = events
    .filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'dateAsc') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'dateDesc') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      return 0;
    });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Events Directory</span>
          <h1>Explore College Events</h1>
          <p>Find workshops, hackathons, and competitions happening on campus</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title, venue, or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            {/* Category Select */}
            <div>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value) {
                    setSearchParams({ category: e.target.value });
                  } else {
                    setSearchParams({});
                  }
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateAsc">Date: Earliest First</option>
                <option value="dateDesc">Date: Latest First</option>
                <option value="title">Title: Alphabetical</option>
                <option value="capacity">Capacity: High to Low</option>
              </select>
            </div>

            {/* Reset button */}
            {(searchQuery || selectedCategory) && (
              <div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSearchParams({});
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: 'var(--error)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #FED7D7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button onClick={fetchEventsAndCategories} className="btn btn-danger btn-sm">
              Retry
            </button>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading campus events from server...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={32} /></div>
            <h3>No Events Found</h3>
            <p>We couldn't find any events matching your selected criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSearchParams({});
              }}
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {filteredEvents.map((event) => {
              const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100));
              const isFull = event.isFull;
              const isClosed = event.isRegistrationClosed;

              return (
                <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                  {/* Event Image Banner */}
                  <div style={{
                    height: '190px',
                    backgroundColor: 'var(--pale-blue)',
                    position: 'relative',
                    backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <span className="badge badge-primary" style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <Tag size={12} /> {event.category}
                    </span>

                    {event.status === 'CANCELLED' ? (
                      <span className="badge badge-danger" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Cancelled
                      </span>
                    ) : isFull ? (
                      <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Full (Waitlist)
                      </span>
                    ) : isClosed ? (
                      <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Closed
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Open
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                      <Link to={`/events/${event.id}`} style={{ color: 'var(--text-main)' }}>
                        {event.title}
                      </Link>
                    </h3>

                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.description}
                    </p>

                    {/* Venue & Organizer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color="var(--primary)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.organizer}</span>
                      </div>
                    </div>

                    {/* Capacity progress */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>Capacity Filled</span>
                        <span>{event.registeredCount || 0} / {event.capacity} seats</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: '#E4E9F2', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${capacityPercent}%`,
                          backgroundColor: capacityPercent >= 90 ? 'var(--error)' : 'var(--primary)',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>

                    {/* Action link */}
                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                      <Link
                        to={`/events/${event.id}`}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
