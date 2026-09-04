const express = require('express');
const router = express.Router();
const Donor = require('../../models/Donor');
const inMemoryStore = require('../../config/inMemoryStore');

// @route   GET /api/donors
// @desc    Get all donors with optional filtering by bloodType and district
// @access  Public (Member C Slice)
router.get('/', async (req, res) => {
  try {
    const { bloodType, district } = req.query;
    const filter = {};

    if (bloodType && bloodType !== 'All') {
      filter.bloodType = bloodType;
    }

    if (district && district !== 'All') {
      filter.district = district;
    }

    let donors;
    if (global.isMongoConnected) {
      donors = await Donor.find(filter).sort({ createdAt: -1 });
    } else {
      donors = inMemoryStore.getDonors(filter);
    }

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error browsing donors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving donors',
      error: error.message
    });
  }
});

module.exports = router;

