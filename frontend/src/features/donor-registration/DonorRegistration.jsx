import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import { validateDonorForm } from './validation';
import FormField from '../../components/FormField';
import SelectField from '../../components/SelectField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Heart, ShieldCheck, AlertCircle, CheckCircle2,
  UserCheck, LogOut, Edit3, Phone, Award, Droplets, CalendarDays
} from 'lucide-react';
import './donorRegistration.css';

export default function DonorRegistration() {
  const { userProfile, loginProfile, logoutProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    district: '',
    phone: '',
    lastDonationDate: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  // Pre-fill form when profile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        phone: userProfile.phone || prev.phone,
        district: userProfile.district || prev.district,
        bloodType: userProfile.bloodType || prev.bloodType,
      }));
    }
  }, [userProfile]);

  // Real-time validation
  useEffect(() => {
    const { errors: validationErrors } = validateDonorForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setSubmitStatus({ type: null, message: '' });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const { errors: validationErrors, isValid } = validateDonorForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await api.registerDonor(formData);

      // Auto-authenticate as Voluntary Donor on success
      loginProfile({
        name: formData.name,
        phone: formData.phone,
        district: formData.district,
        bloodType: formData.bloodType,
        role: 'Voluntary Donor'
      });

      setSubmitStatus({
        type: 'success',
        message: response.message || 'You are now registered and authenticated as a voluntary blood donor.'
      });
      setIsEditing(false);
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'Registration failed. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutProfile();
    setFormData({ name: '', bloodType: '', district: '', phone: '', lastDonationDate: '' });
    setTouched({});
    setSubmitStatus({ type: null, message: '' });
    setIsEditing(false);
  };

  const isFormValid = Object.keys(errors).length === 0;

  // ── AUTHENTICATED VIEW ────────────────────────────────────────────────────
  if (userProfile && !isEditing) {
    return (
      <div className="registration-page container section">
        <div className="form-card-container">
          <div className="form-header">
            <div className="icon-badge donor-badge">
              <Heart size={28} className="badge-icon" fill="currentColor" />
            </div>
            <h2>Donor Dashboard</h2>
            <p className="form-subtitle">You are registered and authenticated as a voluntary blood donor.</p>
          </div>

          {submitStatus.type === 'success' && (
            <div className="alert-box alert-success" role="alert">
              <CheckCircle2 size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <strong>Registration Successful!</strong> {submitStatus.message}
            </div>
          )}

          {/* Authenticated Donor Profile Card */}
          <div className="donor-profile-card">
            <div className="donor-profile-top">
              <div className="donor-avatar-wrap">
                <div className="donor-avatar">
                  <UserCheck size={26} />
                </div>
                {userProfile.bloodType && (
                  <span className="blood-type-badge">{userProfile.bloodType}</span>
                )}
              </div>
              <div className="donor-profile-info">
                <div className="donor-name-row">
                  <h3 className="donor-name">{userProfile.name}</h3>
                  <span className="verified-chip">
                    <ShieldCheck size={12} /> Verified Donor
                  </span>
                </div>
                <span className="donor-role-tag">
                  {userProfile.role} · {userProfile.district}
                </span>
              </div>
              <div className="donor-actions">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </Button>
              </div>
            </div>

            <div className="donor-stats-row">
              <div className="donor-stat-item">
                <Phone size={15} className="stat-icon" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="donor-stat-item">
                <Award size={15} className="stat-icon" />
                <span>Active Donor</span>
              </div>
              {userProfile.bloodType && (
                <div className="donor-stat-item">
                  <Droplets size={15} className="stat-icon" />
                  <span>Blood Group {userProfile.bloodType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick re-register prompt */}
          <div className="reregister-prompt">
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Want to update your blood group or last donation date?
            </p>
            <Button variant="primary" size="md" onClick={() => setIsEditing(true)} fullWidth>
              <CalendarDays size={16} /> Update Donor Information
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTRATION FORM VIEW ────────────────────────────────────────────────
  return (
    <div className="registration-page container section">
      <div className="form-card-container">
        <div className="form-header">
          <div className="icon-badge donor-badge">
            <Heart size={28} className="badge-icon" fill="currentColor" />
          </div>
          <h2>Register as a Voluntary Donor</h2>
          <p className="form-subtitle">
            Join Sri Lanka's healthcare network and help bridge regional blood supply gaps. Your profile is saved securely in your browser.
          </p>
        </div>

        {submitStatus.type === 'error' && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <strong>Registration Notice:</strong> {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Step indicator */}
          <div className="form-section-label">
            <span className="section-step">01</span>
            <span className="section-title">Personal Information</span>
          </div>

          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Kasun Perera"
            error={touched.name && errors.name}
            required
          />

          <FormField
            label="Phone Number (Sri Lanka)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 0771234567 or +94771234567"
            error={touched.phone && errors.phone}
            helperText="10-digit Sri Lankan mobile or landline number"
            required
          />

          {/* Step 2 */}
          <div className="form-section-label" style={{ marginTop: '1.75rem' }}>
            <span className="section-step">02</span>
            <span className="section-title">Donor Details</span>
          </div>

          <div className="form-row grid-2">
            <SelectField
              label="Blood Type"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              onBlur={handleBlur}
              options={BLOOD_TYPES}
              placeholder="Select Blood Type"
              error={touched.bloodType && errors.bloodType}
              required
            />

            <SelectField
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              onBlur={handleBlur}
              options={SRI_LANKAN_DISTRICTS}
              placeholder="Select District"
              error={touched.district && errors.district}
              required
            />
          </div>

          <FormField
            label="Last Donation Date"
            name="lastDonationDate"
            type="date"
            value={formData.lastDonationDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastDonationDate && errors.lastDonationDate}
            helperText="If you are a first-time donor, select today's date"
            required
          />

          {/* Step 3 */}
          <div className="form-section-label" style={{ marginTop: '1.75rem' }}>
            <span className="section-step">03</span>
            <span className="section-title">Account Security</span>
          </div>

          <div className="form-row grid-2">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a strong password"
              error={touched.password && errors.password}
              helperText="At least 6 characters"
              required
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              error={touched.confirmPassword && errors.confirmPassword}
              required
            />
          </div>

          <div className="disclaimer-banner flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
            <ShieldCheck size={16} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
            <span>
              <strong>Medical Disclaimer:</strong> Indicative eligibility only. Final clinical clearance is determined by qualified NBCTS or hospital medical personnel.
            </span>
          </div>

          <div className="form-actions">
            {isEditing && (
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => { setIsEditing(false); setSubmitStatus({ type: null, message: '' }); }}
                style={{ marginBottom: '0.75rem', width: '100%' }}
              >
                ← Back to Profile
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Registering...' : isEditing ? 'Update Donor Profile' : 'Register as Voluntary Donor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
