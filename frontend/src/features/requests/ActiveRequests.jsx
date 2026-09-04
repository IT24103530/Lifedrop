import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import RequestCard from '../../components/RequestCard';
import { Activity, RefreshCw, AlertCircle, X, Edit3, Trash2, CheckCircle } from 'lucide-react';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import './requests.css';

export default function ActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchActiveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getActiveRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError('Failed to fetch active requests. Please ensure backend is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const handleOpenEdit = (request) => {
    setEditingRequest(request);
    setEditFormData({
      patientHospital: request.patientHospital || request.hospital || '',
      bloodType: request.bloodType || request.bloodGroupNeeded || 'A+',
      unitsNeeded: request.unitsNeeded || 1,
      urgency: request.urgency || 'Normal',
      district: request.district || request.city || 'Colombo',
      status: request.status || 'open'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.updateRequest(editingRequest._id || editingRequest.id, editFormData);
      setSuccessMsg('Blood request updated successfully!');
      setEditingRequest(null);
      fetchActiveRequests();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update blood request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRequestId) return;
    setActionLoading(true);
    setError(null);
    try {
      await api.deleteRequest(deletingRequestId);
      setSuccessMsg('Blood request deleted successfully!');
      setDeletingRequestId(null);
      fetchActiveRequests();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete blood request');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="active-requests-page container section">
      <div className="page-header">
        <div className="header-title-group">
          <h2><Activity className="title-icon" /> Active Patient Blood Requests</h2>
          <p className="subtitle">
            Urgent requests sorted by priority (Critical &gt; Urgent &gt; Normal) across Sri Lankan hospitals.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="alert-box alert-success">
          <CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {error}
        </div>
      )}

      <div className="urgency-priority-legend">
        <div className="legend-item"><span className="legend-dot critical-dot"></span> 🚨 Critical Priority</div>
        <div className="legend-item"><span className="legend-dot urgent-dot"></span> ⚠️ Urgent Priority</div>
        <div className="legend-item"><span className="legend-dot normal-dot"></span> ℹ️ Normal Priority</div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading active blood requests...</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            Showing <strong>{requests.length}</strong> active patient request{requests.length !== 1 ? 's' : ''}
          </div>

          {requests.length === 0 ? (
            <div className="empty-state">
              <p>No active blood requests posted at this time.</p>
            </div>
          ) : (
            <div className="requests-grid grid-2">
              {requests.map((request) => (
                <RequestCard
                  key={request._id || request.id || Math.random()}
                  request={request}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeletingRequestId(id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Request Modal */}
      {editingRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><Edit3 size={18} /> Edit Blood Request</h3>
              <button className="modal-close-btn" onClick={() => setEditingRequest(null)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <FormField
                label="Hospital / Medical Facility"
                value={editFormData.patientHospital}
                onChange={(e) => setEditFormData({ ...editFormData, patientHospital: e.target.value })}
                required
              />

              <FormField label="Blood Type">
                <select
                  value={editFormData.bloodType}
                  onChange={(e) => setEditFormData({ ...editFormData, bloodType: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Units Needed"
                type="number"
                min="1"
                max="10"
                value={editFormData.unitsNeeded}
                onChange={(e) => setEditFormData({ ...editFormData, unitsNeeded: parseInt(e.target.value) || 1 })}
              />

              <FormField label="Urgency Level">
                <select
                  value={editFormData.urgency}
                  onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </FormField>

              <FormField label="District">
                <select
                  value={editFormData.district}
                  onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  <option value="open">Open</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="expired">Expired</option>
                </select>
              </FormField>

              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => setEditingRequest(null)}>Cancel</Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRequestId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ color: '#D62828', marginBottom: '1rem' }}>
              <Trash2 size={42} />
            </div>
            <h3>Delete Blood Request?</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>
              Are you sure you want to delete this blood request? This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <Button type="button" variant="outline" onClick={() => setDeletingRequestId(null)}>Cancel</Button>
              <Button
                type="button"
                style={{ backgroundColor: '#D62828', color: '#fff' }}
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
