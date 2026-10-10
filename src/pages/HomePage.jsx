import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Search, 
  Bell, 
  Clock, 
  Tag 
} from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, annRes] = await Promise.all([
          client.get('/api/events'),
          client.get('/api/announcements')
        ]);
        setFeaturedEvents(eventsRes.data.slice(0, 3));
        setAnnouncements(annRes.data.slice(0, 2));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Hackathons', desc: 'Competitions & sprints', color: 'var(--pale-blue)' },
    { name: 'Workshops', desc: 'Hands-on practicals', color: 'var(--pale-mint)' },
    { name: 'Technical Fests', desc: 'Flagship annual events', color: 'var(--pale-lavender)' },
    { name: 'Club Events', desc: 'Student interest clubs', color: '#FEF3C7' },
    { name: 'Seminars', desc: 'Keynotes & expert talks', color: '#FEE2E2' },
    { name: 'Competitions', desc: 'Quizzes & challenges', color: 'var(--pale-blue)' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      {/* Announcements Alert Banner */}
      {announcements.length > 0 && (
        <div style={{
          backgroundColor: 'var(--pale-blue)',
          borderBottom: '1px solid #D6E4FC',
          padding: '10px 0',
          fontSize: '0.88rem'
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-primary">
              <Bell size={12} /> Announcement
            </span>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
              {announcements[0].title}:
            </span>
            <span style={{ color: 'var(--text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {announcements[0].content}
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        padding: '70px 0 60px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pale-blue)',
            color: 'var(--primary)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '20px',
            border: '1px solid #D6E4FC'
          }}>
            <Sparkles size={16} /> Centralized Campus Event Management
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: 'var(--text-main)',
            letterSpacing: '-0.8px',
            lineHeight: '1.2',
            marginBottom: '20px'
          }}>
            Discover, Register, and Experience Every College Event in One Place
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '36px'
          }}>
            Campus Event Hub brings together workshops, nationwide hackathons, technical symposiums, and cultural fests. Stay informed, reserve your seat instantly, and build your extracurricular portfolio.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary btn-lg">
              <Search size={18} /> Browse College Events
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Student Account <ArrowRight size={18} />
              </Link>
            ) : isStudent ? (
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                Go to Student Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="btn btn-secondary btn-lg">
                Open Administrator Panel <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Upcoming Highlights</span>
              <h2>Featured College Events</h2>
              <p>Top workshops and competitions with open registrations</p>
            </div>
            <Link to="/events" className="btn btn-outline">
              View All Events <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={32} /></div>
              <h3>No Events Listed Yet</h3>
              <p>Check back shortly as event organizers publish upcoming schedules.</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredEvents.map((event) => (
                <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                  <div style={{
                    height: '180px',
                    backgroundColor: 'var(--pale-blue)',
                    position: 'relative',
                    backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <span className="badge badge-primary" style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backdropFilter: 'blur(8px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      <Tag size={12} /> {event.category}
                    </span>
                  </div>

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                      <Link to={`/events/${event.id}`} style={{ color: 'var(--text-main)' }}>
                        {event.title}
                      </Link>
                    </h3>

                    <p style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.description}
                    </p>

                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} />
                        <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {event.venue}
                        </span>
                      </div>

                      <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '50px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2>Explore by Category</h2>
            <p>Find events that align with your technical and cultural interests</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  textAlign: 'center'
                }}
                className="category-card"
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'var(--text-main)'
                }}>
                  <Tag size={22} color="var(--primary)" />
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-main)' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2>How Campus Event Hub Works</h2>
            <p>Seamless 3-step participation designed specifically for university students</p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--pale-blue)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                1
              </div>
              <h3 style={{ marginBottom: '10px' }}>Discover & Filter</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                Browse verified events hosted across departments, student clubs, and tech societies with filters for dates and tracks.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--pale-lavender)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                2
              </div>
              <h3 style={{ marginBottom: '10px' }}>Instant Registration</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                Register in one click using your student credentials. Real-time slot reservation ensures no double bookings.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--pale-mint)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                3
              </div>
              <h3 style={{ marginBottom: '10px' }}>Attend & Provide Feedback</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                Check in at the venue, track your attendance status in your dashboard, and submit ratings for each workshop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      {!isAuthenticated && (
        <section style={{ padding: '0 0 70px' }}>
          <div className="container">
            <div style={{
              backgroundColor: 'var(--pale-blue)',
              border: '1px solid #D6E4FC',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 32px',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>
                Ready to Join the Next Campus Hackathon or Workshop?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 28px' }}>
                Sign up today with your student ID to reserve slots for upcoming university symposiums and technical conferences.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Student Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
