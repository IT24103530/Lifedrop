import { SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';

export function validateRequestForm(formData) {
  const errors = {};

  // Patient/Hospital validation
  if (!formData.patientHospital || !formData.patientHospital.trim()) {
    errors.patientHospital = 'Patient or Hospital details are required.';
  } else if (formData.patientHospital.trim().length < 3) {
    errors.patientHospital = 'Must be at least 3 characters long.';
  }

  // Blood Type validation
  if (!formData.bloodType) {
    errors.bloodType = 'Please select requested blood type.';
  } else if (!BLOOD_TYPES.includes(formData.bloodType)) {
    errors.bloodType = 'Invalid blood type selected.';
  }

  // Urgency validation
  const validUrgencies = ['Critical', 'Urgent', 'Normal'];
  if (!formData.urgency) {
    errors.urgency = 'Please select urgency level.';
  } else if (!validUrgencies.includes(formData.urgency)) {
    errors.urgency = 'Invalid urgency level.';
  }

  // District validation
  if (!formData.district) {
    errors.district = 'Please select district.';
  } else if (!SRI_LANKAN_DISTRICTS.includes(formData.district)) {
    errors.district = 'Invalid Sri Lankan district selected.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
