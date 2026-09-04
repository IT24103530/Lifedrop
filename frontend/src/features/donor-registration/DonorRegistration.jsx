import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import { validateDonorForm } from './validation';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import './donorRegistration.css';

export default function DonorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    district: '',
    phone: '',
    lastDonationDate: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const { errors: validationErrors, isValid } = validateDonorForm(formData);
    setErrors(validationErrors);

    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await api.registerDonor(formData);
      setSubmitStatus({
        type: 'success',
        message: response.message || 'Thank you! You have been successfully registered as a voluntary blood donor.'
      });
      // Reset form
      setFormData({
        name: '',
        bloodType: '',
        district: '',
        phone: '',
        lastDonationDate: ''
      });
      setTouched({});
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'Failed to register donor. Please check network connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="registration-page container section">
      <div className="form-card-container">
        <div className="form-header">
          <div className="icon-badge">
            <UserCheck size={28} className="badge-icon" />
          </div>
          <h2>Register as a Voluntary Donor</h2>
          <p className="form-subtitle">
            Join Sri Lanka's life-saving network. Help bridge regional blood supply gaps in critical districts.
          </p>
        </div>

        {submitStatus.type === 'success' && (
          <div className="alert-box alert-success" role="alert">
            <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <strong>Registration Successful!</strong> {submitStatus.message}
          </div>
        )}

        {submitStatus.type === 'error' && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <strong>Registration Failed:</strong> {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Kasun Perera"
            error={touched.name && errors.name}
            required
          />

          <div className="form-row grid-2">
            <FormField
              label="Blood Type"
              name="bloodType"
              type="select"
              value={formData.bloodType}
              onChange={handleChange}
              options={BLOOD_TYPES}
              error={touched.bloodType && errors.bloodType}
              required
            />

            <FormField
              label="District"
              name="district"
              type="select"
              value={formData.district}
              onChange={handleChange}
              options={SRI_LANKAN_DISTRICTS}
              error={touched.district && errors.district}
              required
            />
          </div>

          <FormField
            label="Phone Number (Sri Lanka)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 0771234567 or +94771234567"
            error={touched.phone && errors.phone}
            helperText="Mobile or landline number for urgent contact"
            required
          />

          <FormField
            label="Last Donation Date"
            name="lastDonationDate"
            type="date"
            value={formData.lastDonationDate}
            onChange={handleChange}
            error={touched.lastDonationDate && errors.lastDonationDate}
            helperText="If you have never donated before, select today's date"
            required
          />

          <div className="disclaimer-banner">
            <strong>Medical Disclaimer:</strong> Indicative eligibility only. Final donation clearance is conducted by National Blood Transfusion Service (NBTS) medical officers.
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register as Blood Donor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
