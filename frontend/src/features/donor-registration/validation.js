import { SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';

export function validateDonorForm(formData) {
  const errors = {};

  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  // Blood type validation
  if (!formData.bloodType) {
    errors.bloodType = 'Please select a blood type.';
  } else if (!BLOOD_TYPES.includes(formData.bloodType)) {
    errors.bloodType = 'Invalid blood type selected.';
  }

  // District validation
  if (!formData.district) {
    errors.district = 'Please select your district.';
  } else if (!SRI_LANKAN_DISTRICTS.includes(formData.district)) {
    errors.district = 'Invalid Sri Lankan district selected.';
  }

  // Phone validation (Sri Lankan format)
  const phoneClean = (formData.phone || '').replace(/[\s\-]/g, '');
  const slPhoneRegex = /^(?:\+94|0)?7[0-9]{8}$|^(?:\+94|0)?(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)[0-9]{7}$/;
  
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!slPhoneRegex.test(phoneClean)) {
    errors.phone = 'Enter a valid Sri Lankan mobile/landline (e.g. 0771234567 or +94771234567).';
  }

  // Last donation date validation
  if (!formData.lastDonationDate) {
    errors.lastDonationDate = 'Last donation date is required.';
  } else {
    const selectedDate = new Date(formData.lastDonationDate);
    const today = new Date();
    if (isNaN(selectedDate.getTime())) {
      errors.lastDonationDate = 'Please enter a valid date.';
    } else if (selectedDate > today) {
      errors.lastDonationDate = 'Last donation date cannot be in the future.';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
