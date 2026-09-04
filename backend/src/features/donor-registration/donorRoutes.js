const express = require('express');
const router = express.Router();
const Donor = require('../../models/Donor');

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

    const donor = await Donor.create({
      name,
      bloodType,
      district,
      phone,
      lastDonationDate: donationDate
    });

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

// @route   PUT /api/donors/:id
// @desc    Update donor details
// @access  Public / Protected
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bloodType, district, phone, lastDonationDate, status } = req.body;

    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor record not found'
      });
    }

    if (name) donor.name = name;
    if (bloodType) donor.bloodType = bloodType;
    if (district) donor.district = district;
    if (phone) {
      if (!isValidSLPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Sri Lankan phone number format.'
        });
      }
      donor.phone = phone;
    }
    if (lastDonationDate) {
      const dDate = new Date(lastDonationDate);
      if (!isNaN(dDate.getTime()) && dDate <= new Date()) {
        donor.lastDonationDate = dDate;
      }
    }
    if (status) donor.status = status;

    await donor.save();

    res.status(200).json({
      success: true,
      message: 'Donor record updated successfully',
      data: donor
    });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating donor record',
      error: error.message
    });
  }
});

// @route   DELETE /api/donors/:id
// @desc    Delete a donor record
// @access  Public / Protected
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor record not found'
      });
    }

    await Donor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Donor record deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting donor record',
      error: error.message
    });
  }
});

module.exports = router;
