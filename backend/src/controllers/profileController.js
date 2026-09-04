const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Protected
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Protected
const updateProfile = async (req, res) => {
  try {
    const { name, bloodGroup, phone, city, dateOfBirth, lastDonationDate, notificationPreference } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;

    if (bloodGroup !== undefined) {
      const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'
        });
      }
      user.bloodGroup = bloodGroup;
    }

    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (lastDonationDate !== undefined) user.lastDonationDate = lastDonationDate;
    if (notificationPreference !== undefined) user.notificationPreference = Boolean(notificationPreference);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
