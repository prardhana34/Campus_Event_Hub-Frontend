import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  BookmarkCheck, 
  LayoutDashboard,
  Bell,
  Users,
  Compass,
  Home
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(37, 50, 74, 0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            textDecoration: 'none',
            outline: 'none'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #4F7DF3 0%, #3D68D8 100%)',
            color: '#FFFFFF',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(79, 125, 243, 0.28)'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.28rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
              Campus<span style={{ color: 'var(--primary)' }}>EventHub</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '8px', alignItems: 'center' }} className="desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/events" 
            className={`nav-link ${isActive('/events') && !location.pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Browse Events</span>
          </Link>

          {/* Student Specific Links */}
          {isAuthenticated && !isAdmin && (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/my-registrations" 
                className={`nav-link ${isActive('/my-registrations') ? 'active' : ''}`}
              >
                <BookmarkCheck size={16} />
                <span>My Registrations</span>
              </Link>
            </>
          )}

          {/* Administrator Specific Link */}
          {isAuthenticated && isAdmin && (
            <>
              <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)', margin: '0 4px' }} />
              
              <Link 
                to="/admin/dashboard" 
                className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                style={{
                  backgroundColor: location.pathname.startsWith('/admin') ? 'var(--pale-lavender)' : 'transparent',
                  color: location.pathname.startsWith('/admin') ? 'var(--secondary)' : 'var(--text-secondary)',
                  fontWeight: '600'
                }}
              >
                <ShieldCheck size={17} color="var(--secondary)" />
                <span>Admin Console</span>
              </Link>
            </>
          )}
        </div>

        {/* Desktop Auth Controls */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link 
                to="/profile" 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '6px 14px 6px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isAdmin ? 'var(--pale-lavender)' : 'var(--pale-blue)',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  border: `1px solid ${isAdmin ? '#E2DCFF' : '#D6E4FC'}`,
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? 'var(--secondary)' : 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: '700', 
                    color: isAdmin ? 'var(--secondary)' : 'var(--primary)',
                    letterSpacing: '0.5px'
                  }}>
                    {isAdmin ? 'ADMINISTRATOR' : 'STUDENT'}
                  </span>
                </div>
              </Link>

              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm"
                title="Log out of account"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Student Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
            <Home size={18} /> Home
          </Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
            <Compass size={18} /> Browse Events
          </Link>
          
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <LayoutDashboard size={18} /> Student Dashboard
              </Link>
              <Link to="/my-registrations" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <BookmarkCheck size={18} /> My Registrations
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <User size={18} /> My Profile
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <div style={{ 
                padding: '8px 12px', 
                fontSize: '0.78rem', 
                fontWeight: '700', 
                color: 'var(--secondary)', 
                letterSpacing: '0.8px', 
                backgroundColor: 'var(--pale-lavender)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '6px'
              }}>
                ADMINISTRATION CONSOLE
              </div>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <LayoutDashboard size={18} /> Dashboard & Analytics
              </Link>
              <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <Calendar size={18} /> Manage Events
              </Link>
              <Link to="/admin/registrations" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <BookmarkCheck size={18} /> Registrations & Attendance
              </Link>
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <Users size={18} /> Manage Students
              </Link>
              <Link to="/admin/announcements" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <Bell size={18} /> Campus Notices
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ width: '100%' }}>
                <User size={18} /> Admin Profile
              </Link>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '10px' }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                <LogOut size={16} /> Logout ({user?.fullName})
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ width: '100%' }}>Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>Register as Student</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
