import React, { useState, useEffect } from 'react';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import { validateRequestForm } from './validation';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { FilePlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import './bloodRequest.css';

export default function BloodRequest() {
  const [formData, setFormData] = useState({
    patientHospital: '',
    bloodType: '',
    urgency: 'Normal',
    district: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    const { errors: validationErrors } = validateRequestForm(formData);
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

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const { errors: validationErrors, isValid } = validateRequestForm(formData);
    setErrors(validationErrors);

    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await api.submitRequest(formData);
      setSubmitStatus({
        type: 'success',
        message: response.message || 'Blood request submitted successfully! Donors in your district will be able to view this active request.'
      });
      setFormData({
        patientHospital: '',
        bloodType: '',
        urgency: 'Normal',
        district: ''
      });
      setTouched({});
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'Failed to submit blood request. Please check network connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  const urgencyOptions = [
    { value: 'Critical', label: '🚨 Critical (Immediate Need)' },
    { value: 'Urgent', label: '⚠️ Urgent (Within 24 Hours)' },
    { value: 'Normal', label: 'ℹ️ Normal (Scheduled Operation/Support)' }
  ];

  return (
    <div className="request-page container section">
      <div className="form-card-container">
        <div className="form-header">
          <div className="icon-badge">
            <FilePlus size={28} className="badge-icon" />
          </div>
          <h2>Post an Urgent Blood Request</h2>
          <p className="form-subtitle">
            Connect patients and families directly with registered donors across Sri Lankan districts.
          </p>
        </div>

        {submitStatus.type === 'success' && (
          <div className="alert-box alert-success" role="alert">
            <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <strong>Request Published!</strong> {submitStatus.message}
          </div>
        )}

        {submitStatus.type === 'error' && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <strong>Submission Failed:</strong> {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Patient Name & Hospital / Ward"
            name="patientHospital"
            value={formData.patientHospital}
            onChange={handleChange}
            placeholder="e.g. Jaffna Teaching Hospital - ICU Ward 3"
            error={touched.patientHospital && errors.patientHospital}
            helperText="Include hospital name and ward/bed details for quick verification"
            required
          />

          <div className="form-row grid-2">
            <FormField
              label="Blood Type Needed"
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
            label="Urgency Level"
            name="urgency"
            type="select"
            value={formData.urgency}
            onChange={handleChange}
            options={urgencyOptions}
            error={touched.urgency && errors.urgency}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blood Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
