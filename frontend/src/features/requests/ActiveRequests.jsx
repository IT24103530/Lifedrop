import React, { useState, useEffect } from 'react';
import { api } from '../../app/api';
import RequestCard from '../../components/RequestCard';
import { Activity, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import './requests.css';

export default function ActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <RequestCard key={request._id || request.patientHospital} request={request} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
