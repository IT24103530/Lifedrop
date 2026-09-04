import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Droplet, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import './Auth.css';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bloodGroup) {
      setError('Please select your blood group to continue.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        bloodGroup,
        phone,
        city
      });
      navigate('/browse');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card glass-panel text-center">
        <div className="auth-header">
          <div className="auth-icon-wrapper text-danger">
            <ShieldAlert size={36} />
          </div>
          <h2>Action Required: Select Blood Group</h2>
          <p>
            To receive urgent blood alerts and participate as a voluntary donor, you must specify your blood group.
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">
              <Droplet size={18} className="form-label-icon text-danger" />
              Blood Group <span className="required-star">*</span>
            </label>
            <select
              className="form-control form-select"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
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

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">District / City (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Colombo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '12px' }}>
            <CheckCircle size={18} /> {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
