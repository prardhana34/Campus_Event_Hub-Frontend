import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Phone, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border)',
      padding: '48px 0 24px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'var(--pale-blue)',
                color: 'var(--primary)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Campus<span style={{ color: 'var(--primary)' }}>EventHub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The official centralized platform for exploring, registering, and managing university events, workshops, hackathons, and symposiums.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)' }}>Home Overview</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-secondary)' }}>Browse All Events</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Student Registration</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>Portal Login</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Event Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/events?category=Hackathons" style={{ color: 'var(--text-secondary)' }}>Hackathons & Coding</Link></li>
              <li><Link to="/events?category=Workshops" style={{ color: 'var(--text-secondary)' }}>Technical Workshops</Link></li>
              <li><Link to="/events?category=Technical+Fests" style={{ color: 'var(--text-secondary)' }}>Annual Tech Fests</Link></li>
              <li><Link to="/events?category=Club+Events" style={{ color: 'var(--text-secondary)' }}>Student Club Events</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Support & Office</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>Student Affairs & Events Complex</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--primary)" />
                <span>events@campus.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+1 (555) 234-EVENT</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>© 2026 Campus Event Hub. University Event Management System. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={14} />
            <span>Secure Role-Based Student Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
