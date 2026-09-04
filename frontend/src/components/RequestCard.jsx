import React from 'react';
import { MapPin, AlertCircle, Clock, Building2 } from 'lucide-react';
import './RequestCard.css';

export default function RequestCard({ request }) {
  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'badge-critical';
      case 'Urgent':
        return 'badge-urgent';
      default:
        return 'badge-normal';
    }
  };

  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently';

  return (
    <div className={`request-card urgency-border-${request.urgency?.toLowerCase()}`}>
      <div className="request-card-header">
        <div className="request-blood-type">{request.bloodType}</div>
        <div className="request-header-info">
          <div className="request-badge-row">
            <span className={`badge ${getUrgencyBadgeClass(request.urgency)}`}>
              <AlertCircle size={13} /> {request.urgency} Urgency
            </span>
            <span className="request-time">
              <Clock size={13} /> {formattedDate}
            </span>
          </div>
          <h3 className="request-title">{request.patientHospital}</h3>
        </div>
      </div>

      <div className="request-card-footer">
        <div className="request-district">
          <MapPin size={15} className="pin-icon" />
          <span>District: <strong>{request.district}</strong></span>
        </div>
      </div>
    </div>
  );
}
