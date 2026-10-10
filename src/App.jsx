import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BrowseEventsPage } from './pages/BrowseEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<BrowseEventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Student Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-registrations"
                  element={
                    <ProtectedRoute>
                      <MyRegistrationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Administrator Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/registrations"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminRegistrationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/announcements"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminAnnouncementsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
