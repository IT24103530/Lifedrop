import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import DonorCard from '../../components/DonorCard';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { Users, Filter, RefreshCw, AlertCircle, Edit3, Trash2, CheckCircle } from 'lucide-react';
import './donorBrowse.css';

export default function DonorBrowse() {
  const [selectedBloodType, setSelectedBloodType] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [editingDonor, setEditingDonor] = useState(null);
  const [deletingDonorId, setDeletingDonorId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getDonors(selectedBloodType, selectedDistrict);
      setDonors(response.data || []);
    } catch (err) {
      setError('Failed to fetch donors from backend API. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodType, selectedDistrict]);

  const handleOpenEdit = (donor) => {
    setEditingDonor(donor);
    setEditFormData({
      name: donor.name || '',
      bloodType: donor.bloodType || 'A+',
      district: donor.district || 'Colombo',
      phone: donor.phone || '',
      lastDonationDate: donor.lastDonationDate ? new Date(donor.lastDonationDate).toISOString().split('T')[0] : ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.updateDonor(editingDonor._id || editingDonor.id, editFormData);
      setSuccessMsg('Donor details updated successfully!');
      setEditingDonor(null);
      fetchDonors();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update donor details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDonorId) return;
    setActionLoading(true);
    setError(null);
    try {
      await api.deleteDonor(deletingDonorId);
      setSuccessMsg('Donor record deleted successfully!');
      setDeletingDonorId(null);
      fetchDonors();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete donor record');
    } finally {
      setActionLoading(false);
    }
  };

  const bloodTypeOptions = [{ value: 'All', label: 'All Blood Types' }, ...BLOOD_TYPES];
  const districtOptions = [{ value: 'All', label: 'All Districts' }, ...SRI_LANKAN_DISTRICTS];

  return (
    <div className="browse-page container section">
      <div className="page-header">
        <div className="header-title-group">
          <h2><Users className="title-icon" /> Registered Blood Donors</h2>
          <p className="subtitle">
            Filter available voluntary blood donors by blood group and Sri Lankan district.
          </p>
        </div>
      </div>

      <div className="filter-card glass-panel">
        <div className="filter-header">
          <Filter size={18} />
          <span>Filter Donors</span>
        </div>
        <div className="filter-grid">
          <FormField
            label="Blood Type"
            name="bloodType"
            type="select"
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
            options={bloodTypeOptions}
          />
          <FormField
            label="District"
            name="district"
            type="select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={districtOptions}
          />
        </div>
      </div>

      {successMsg && (
        <div className="alert-box alert-success" style={{ marginTop: '1rem' }}>
          <CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="alert-box alert-error" style={{ marginTop: '1rem' }}>
          <AlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading donors...</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            Showing <strong>{donors.length}</strong> donor{donors.length !== 1 ? 's' : ''} matching criteria
          </div>

          {donors.length === 0 ? (
            <div className="empty-state">
              <p>No donors found matching the selected blood type and district filters.</p>
            </div>
          ) : (
            <div className="donors-grid grid-3">
              {donors.map((donor) => (
                <DonorCard
                  key={donor._id || donor.phone || Math.random()}
                  donor={donor}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeletingDonorId(id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title"><Edit3 size={18} /> Edit Donor Record</h3>
              <button className="modal-close-btn" onClick={() => setEditingDonor(null)}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <FormField
                label="Full Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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

              <FormField
                label="Phone Number"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                required
              />

              <FormField
                label="Last Donation Date"
                type="date"
                value={editFormData.lastDonationDate}
                onChange={(e) => setEditFormData({ ...editFormData, lastDonationDate: e.target.value })}
              />

              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => setEditingDonor(null)}>Cancel</Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Donor Confirmation Modal */}
      {deletingDonorId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ color: '#D62828', marginBottom: '1rem' }}>
              <Trash2 size={42} />
            </div>
            <h3>Delete Donor Profile?</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>
              Are you sure you want to delete this donor record? This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <Button type="button" variant="outline" onClick={() => setDeletingDonorId(null)}>Cancel</Button>
              <Button
                type="button"
                style={{ backgroundColor: '#D62828', color: '#fff' }}
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Record'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
