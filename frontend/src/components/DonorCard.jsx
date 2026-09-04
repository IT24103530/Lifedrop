import React from 'react';
import { MapPin, Phone, Calendar, Edit3, Trash2 } from 'lucide-react';
import EligibilityBadge from '../features/donor-browse/EligibilityBadge';
import './DonorCard.css';

export default function DonorCard({ donor, onEdit, onDelete }) {
  const formattedDate = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <div className="donor-card">
      <div className="donor-card-header">
        <div className="blood-badge">{donor.bloodType}</div>
        <div className="donor-info">
          <h3 className="donor-name">{donor.name}</h3>
          <div className="donor-meta">
            <span className="meta-item">
              <MapPin size={14} /> {donor.district}
            </span>
          </div>
        </div>
      </div>

      <div className="donor-card-body">
        <div className="donor-detail">
          <Phone size={15} className="detail-icon" />
          <a href={`tel:${donor.phone}`} className="phone-link">{donor.phone}</a>
        </div>
        <div className="donor-detail">
          <Calendar size={15} className="detail-icon" />
          <span>Last Donated: <strong>{formattedDate}</strong></span>
        </div>

        <div className="card-eligibility-section">
          <EligibilityBadge lastDonationDate={donor.lastDonationDate} />
        </div>

        {(onEdit || onDelete) && (
          <div className="card-action-buttons">
            {onEdit && (
              <button
                type="button"
                className="card-btn card-btn-edit"
                onClick={() => onEdit(donor)}
                title="Edit Donor Record"
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="card-btn card-btn-delete"
                onClick={() => onDelete(donor._id || donor.id)}
                title="Delete Donor Record"
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
