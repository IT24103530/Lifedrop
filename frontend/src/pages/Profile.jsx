import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Droplet, Phone, MapPin, Calendar, Bell, ShieldCheck, AlertTriangle, Save, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import './Profile.css';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bloodGroup: user?.bloodGroup || '',
    phone: user?.phone || '',
    city: user?.city || user?.district || '',
    lastDonationDate: user?.lastDonationDate ? new Date(user.lastDonationDate).toISOString().split('T')[0] : '',
    notificationPreference: user?.notificationPreference ?? true
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bloodGroup: user.bloodGroup || '',
        phone: user.phone || '',
        city: user.city || user.district || '',
        lastDonationDate: user.lastDonationDate ? new Date(user.lastDonationDate).toISOString().split('T')[0] : '',
        notificationPreference: user.notificationPreference ?? true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.bloodGroup) {
      setError('Blood group cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Eligibility calculation helper
  const isEligible = user?.isEligibleDonor ?? true;

  return (
    <div className="profile-page container">
      <div className="profile-grid">
        {/* Left Column: Summary Card */}
        <div className="profile-summary-card glass-panel text-center">
          <div className="avatar-circle">
            {user?.bloodGroup ? user.bloodGroup : <User size={36} />}
          </div>
          <h2>{user?.name}</h2>
          <p className="user-email">{user?.email}</p>

          <div className="eligibility-status-box">
            {isEligible ? (
              <div className="status-badge eligible">
                <ShieldCheck size={20} />
                <span>Eligible Donor (56-day gap met)</span>
              </div>
            ) : (
              <div className="status-badge ineligible">
                <AlertTriangle size={20} />
                <span>Ineligible (Donated within last 56 days)</span>
              </div>
            )}
          </div>

          <div className="profile-meta-list text-left">
            <div className="meta-item">
              <Droplet size={16} className="text-danger" />
              <span>Blood Group: <strong>{user?.bloodGroup || 'Not specified'}</strong></span>
            </div>
            <div className="meta-item">
              <MapPin size={16} />
              <span>Location: <strong>{user?.city || 'Not specified'}</strong></span>
            </div>
            <div className="meta-item">
              <Phone size={16} />
              <span>Phone: <strong>{user?.phone || 'Not specified'}</strong></span>
            </div>
            <div className="meta-item">
              <Bell size={16} />
              <span>Urgent Alerts: <strong>{user?.notificationPreference ? 'Opted In' : 'Opted Out'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="profile-edit-card glass-panel">
          <div className="edit-card-header">
            <h3>Edit Donor Profile</h3>
            <p>Keep your contact details and last donation date updated</p>
          </div>

          {success && (
            <div className="profile-alert-box success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="profile-alert-box error">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <FormField
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              icon={<User size={18} />}
            />

            <div className="form-group">
              <label className="form-label">
                <Droplet size={18} className="form-label-icon text-danger" />
                Blood Group <span className="required-star">*</span>
              </label>
              <select
                name="bloodGroup"
                className="form-control form-select"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Group...</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Phone Number"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={<Phone size={18} />}
            />

            <div className="form-group">
              <label className="form-label">
                <MapPin size={18} className="form-label-icon" />
                District / City
              </label>
              <select
                name="city"
                className="form-control form-select"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select District...</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Last Blood Donation Date"
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
              icon={<Calendar size={18} />}
            />

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notificationPreference"
                  checked={formData.notificationPreference}
                  onChange={handleChange}
                />
                <span>Receive urgent blood request notifications matching my blood type</span>
              </label>
            </div>

            <Button variant="primary" type="submit" disabled={loading} style={{ marginTop: '16px' }}>
              <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile Updates'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
