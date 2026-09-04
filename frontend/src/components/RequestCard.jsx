import React from 'react';
import { MapPin, AlertCircle, Clock, Edit3, Trash2 } from 'lucide-react';
import './RequestCard.css';

export default function RequestCard({ request, onEdit, onDelete }) {
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
        <div className="request-blood-type">{request.bloodType || request.bloodGroupNeeded}</div>
        <div className="request-header-info">
          <div className="request-badge-row">
            <span className={`badge ${getUrgencyBadgeClass(request.urgency)}`}>
              <AlertCircle size={13} /> {request.urgency} Urgency
            </span>
            <span className="request-time">
              <Clock size={13} /> {formattedDate}
            </span>
          </div>
          <h3 className="request-title">{request.patientHospital || request.hospital}</h3>
        </div>
      </div>

      <div className="request-card-footer">
        <div className="request-district">
          <MapPin size={15} className="pin-icon" />
          <span>District: <strong>{request.district || request.city}</strong></span>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="card-action-buttons">
            {onEdit && (
              <button 
                type="button" 
                className="card-btn card-btn-edit" 
                onClick={() => onEdit(request)}
                title="Edit Request"
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
            {onDelete && (
              <button 
                type="button" 
                className="card-btn card-btn-delete" 
                onClick={() => onDelete(request._id || request.id)}
                title="Delete Request"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
