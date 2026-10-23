import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookmarkCheck, 
  Users, 
  Bell, 
  ShieldCheck, 
  Plus, 
  ExternalLink 
} from 'lucide-react';

export const AdminNav = ({ title, subtitle, actionButton }) => {
  const location = useLocation();

  const navItems = [
    { 
      to: '/admin/dashboard', 
      label: 'Overview & Metrics', 
      icon: LayoutDashboard,
      exact: true
    },
    { 
      to: '/admin/events', 
      label: 'Manage Events', 
      icon: Calendar 
    },
    { 
      to: '/admin/registrations', 
      label: 'Registrations & Attendance', 
      icon: BookmarkCheck 
    },
    { 
      to: '/admin/users', 
      label: 'Student Directory', 
      icon: Users 
    },
    { 
      to: '/admin/announcements', 
      label: 'Campus Notices', 
      icon: Bell 
    },
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 8px rgba(37, 50, 74, 0.03)',
      marginBottom: '32px'
    }}>
      <div className="container">
        {/* Top Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '22px 0 18px',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--pale-lavender)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(139, 124, 246, 0.15)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.2px', margin: 0 }}>
                  {title || 'Administrator Control Center'}
                </h1>
                <span className="badge badge-lavender" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                  ADMIN PORTAL
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                {subtitle || 'Manage events, track student registrations, mark attendance, and broadcast notices'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              className="btn btn-outline btn-sm"
              target="_blank"
              rel="noreferrer"
              title="Open public portal in new tab"
            >
              <span>View Public Portal</span>
              <ExternalLink size={14} />
            </Link>
            {actionButton ? (
              actionButton
            ) : location.pathname !== '/admin/events' ? (
              <Link to="/admin/events" className="btn btn-primary btn-sm">
                <Plus size={15} />
                <span>Create Event</span>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="admin-nav-tabs" style={{ padding: '10px 0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.to 
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`admin-tab ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--pale-blue)' : 'transparent',
                  border: isActive ? '1px solid #D7E5FE' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={17} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
