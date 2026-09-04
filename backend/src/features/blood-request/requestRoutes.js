const express = require('express');
const router = express.Router();
const Request = require('../../models/Request');

// @route   POST /api/requests
// @desc    Submit a new blood request
// @access  Public (Member B Slice)
router.post('/', async (req, res) => {
  try {
    const { patientHospital, bloodType, urgency, district } = req.body;

    // Field presence validation
    if (!patientHospital || !bloodType || !urgency || !district) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patientHospital, bloodType, urgency, district.'
      });
    }

    // Enum validations
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
      });
    }

    const validUrgencies = ['Critical', 'Urgent', 'Normal'];
    if (!validUrgencies.includes(urgency)) {
      return res.status(400).json({
        success: false,
        message: `Invalid urgency level. Must be one of: ${validUrgencies.join(', ')}`
      });
    }

    const bloodRequest = await Request.create({
      patientHospital,
      bloodType,
      urgency,
      district
    });

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully!',
      data: bloodRequest
    });
  } catch (error) {
    console.error('Error submitting Blood Request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating blood request',
      error: error.message
    });
  }
});

module.exports = router;
