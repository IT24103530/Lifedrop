const express = require('express');
const router = express.Router();
const Donor = require('../../models/Donor');
const inMemoryStore = require('../../config/inMemoryStore');

// Sri Lankan phone validation helper
const isValidSLPhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  return /^(?:\+94|0)?7[0-9]{8}$/.test(cleanPhone) || /^(?:\+94|0)?(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)[0-9]{7}$/.test(cleanPhone);
};

// @route   POST /api/donors
// @desc    Register a new blood donor
// @access  Public (Member A Slice)
router.post('/', async (req, res) => {
  try {
    const { name, bloodType, district, phone, lastDonationDate } = req.body;

    // Field presence validation
    if (!name || !bloodType || !district || !phone || !lastDonationDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, bloodType, district, phone, lastDonationDate.'
      });
    }

    // Blood type validation
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
      });
    }

    // Phone validation
    if (!isValidSLPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Sri Lankan phone number format. Example: 0771234567 or +94771234567'
      });
    }

    // Date validation - cannot be in future
    const donationDate = new Date(lastDonationDate);
    if (isNaN(donationDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date provided for last donation date.'
      });
    }

    if (donationDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Last donation date cannot be in the future.'
      });
    }

    let donor;
    if (global.isMongoConnected) {
      donor = await Donor.create({
        name,
        bloodType,
        district,
        phone,
        lastDonationDate: donationDate
      });
    } else {
      donor = inMemoryStore.addDonor({
        name,
        bloodType,
        district,
        phone,
        lastDonationDate: donationDate.toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully!',
      data: donor
    });
  } catch (error) {
    console.error('Error in Donor Registration:', error);
    res.status(500).json({
      success: false,
      message: 'Server error registering donor',
      error: error.message
    });
  }
});

module.exports = router;

