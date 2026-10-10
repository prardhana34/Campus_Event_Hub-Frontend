import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';

export const AdminAnnouncementsPage = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    active: true,
  });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await client.get('/api/admin/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      showToast('Failed to load campus announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAnn(null);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (ann) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      content: ann.content,
      category: ann.category || 'General',
      active: ann.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      if (editingAnn) {
        await client.put(`/api/admin/announcements/${editingAnn.id}`, formData);
        showToast('Announcement updated!', 'success');
      } else {
        await client.post('/api/admin/announcements', formData);
        showToast('Announcement broadcasted!', 'success');
      }
      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save announcement', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await client.delete(`/api/admin/announcements/${id}`);
      showToast('Announcement deleted', 'success');
      fetchAnnouncements();
    } catch (err) {
      showToast('Failed to delete announcement', 'error');
    }
  };

  return (
    <div>
      <AdminNav 
        title="Campus Announcements Board" 
        subtitle="Publish news, deadline alerts, and general notices to all students"
        actionButton={
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> New Announcement
          </button>
        }
      />
      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Announcements List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="spinner spinner-blue" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
            <p>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={32} /></div>
            <h3>No Announcements Published</h3>
            <p>Create your first notice to broadcast it across student dashboards.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {announcements.map((ann) => (
              <div key={ann.id} className="card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-primary">{ann.category}</span>
                    <span className={`badge ${ann.active ? 'badge-success' : 'badge-warning'}`}>
                      {ann.active ? 'Published' : 'Hidden'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(ann)} className="btn btn-outline btn-sm">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{ann.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
                  {ann.content}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Author: {ann.authorName} • Posted on: {new Date(ann.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingAnn ? 'Edit Announcement' : 'Publish Announcement'}</h3>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Notice Title *</label>
                  <input
                    id="title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Workshop Registration Deadline Extended"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Important">Important</option>
                    <option value="Event Update">Event Update</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="content">Notice Content *</label>
                  <textarea
                    id="content"
                    className="form-textarea"
                    rows="4"
                    placeholder="Write detailed announcements for the campus community..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <input
                    id="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="active" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                    Broadcast visibly on home and dashboard feeds
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" disabled={modalLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                    {modalLoading ? 'Saving...' : editingAnn ? 'Save Changes' : 'Broadcast Now'}
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
