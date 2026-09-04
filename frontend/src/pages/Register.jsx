import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Droplet, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import './Auth.css';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: '',
    phone: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.bloodGroup) {
      setError('Blood group is required.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/browse');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card glass-panel wide-card">
        <div className="auth-header text-center">
          <div className="auth-icon-wrapper">
            <UserPlus size={28} />
          </div>
          <h2>Join the LifeDrop Network</h2>
          <p>Create your account to save lives and receive urgent blood alerts</p>
        </div>

        {error && (
          <div className="auth-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form grid-2">
          <FormField
            label="Full Name"
            type="text"
            name="name"
            placeholder="e.g. Kasun Perera"
            value={formData.name}
            onChange={handleChange}
            required
            icon={<User size={18} />}
          />

          <FormField
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail size={18} />}
          />

          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock size={18} />}
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
            placeholder="0771234567"
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

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="auth-footer text-center">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
