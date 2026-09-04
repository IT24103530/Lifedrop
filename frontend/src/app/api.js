const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = localStorage.getItem('lifedrop_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers, credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Health check
  getHealth: () => request('/health'),

  // Member A: Donor Registration
  registerDonor: (donorData) =>
    request('/donors', {
      method: 'POST',
      body: JSON.stringify(donorData)
    }),

  // Member B: Blood Request
  submitRequest: (requestData) =>
    request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    }),

  // Member C: Browse Donors (with filter params)
  getDonors: (bloodType = 'All', district = 'All') => {
    const params = new URLSearchParams();
    if (bloodType && bloodType !== 'All') params.append('bloodType', bloodType);
    if (district && district !== 'All') params.append('district', district);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/donors${queryString}`);
  },

  // Member D: Active Requests
  getActiveRequests: () => request('/requests')
};

export const SRI_LANKAN_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya'
];

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
