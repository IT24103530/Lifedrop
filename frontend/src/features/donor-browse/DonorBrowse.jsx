import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import DonorCard from '../../components/DonorCard';
import FormField from '../../components/FormField';
import { Users, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import './donorBrowse.css';

export default function DonorBrowse() {
  const [selectedBloodType, setSelectedBloodType] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {error && (
        <div className="alert-box alert-error">
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
                <DonorCard key={donor._id || donor.phone} donor={donor} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
