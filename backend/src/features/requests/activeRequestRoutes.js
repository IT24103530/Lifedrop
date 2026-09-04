const express = require('express');
const router = express.Router();
const Request = require('../../models/Request');

// Priority mapping for urgency sorting
const urgencyPriority = {
  Critical: 1,
  Urgent: 2,
  Normal: 3
};

// @route   GET /api/requests
// @desc    Get active blood requests sorted by urgency (Critical > Urgent > Normal)
// @access  Public (Member D Slice)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({});

    // Sort in memory according to custom urgency priority
    const sortedRequests = requests.sort((a, b) => {
      const priorityA = urgencyPriority[a.urgency] || 99;
      const priorityB = urgencyPriority[b.urgency] || 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: sortedRequests.length,
      data: sortedRequests
    });
  } catch (error) {
    console.error('Error retrieving active requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving active requests',
      error: error.message
    });
  }
});

module.exports = router;
