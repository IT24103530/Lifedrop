const Request = require('../models/Request');
const { dispatchUrgentRequestAlert } = require('../services/alertService');

// @desc    Create a new blood request & trigger urgent alerts
// @route   POST /api/requests
// @access  Public or Protected
const createRequest = async (req, res) => {
  try {
    const {
      patientHospital,
      patientName,
      hospital,
      bloodType,
      bloodGroupNeeded,
      unitsNeeded,
      urgency,
      district,
      city,
      expiresAt
    } = req.body;

    const bType = bloodType || bloodGroupNeeded;
    const locDistrict = district || city;
    const hosp = patientHospital || hospital;

    if (!bType || !locDistrict || !hosp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: blood type, district/city, and hospital/patient name.'
      });
    }

    const requesterId = req.user ? req.user._id : null;

    const newRequest = await Request.create({
      requesterId,
      patientHospital: hosp,
      patientName: patientName || hosp,
      hospital: hosp,
      bloodType: bType,
      bloodGroupNeeded: bType,
      unitsNeeded: unitsNeeded || 1,
      urgency: urgency || 'Normal',
      district: locDistrict,
      city: locDistrict,
      status: 'open',
      expiresAt: expiresAt || null
    });

    // Trigger alert matching and notifications asynchronously
    dispatchUrgentRequestAlert(newRequest);

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating blood request',
      error: error.message
    });
  }
};

// @desc    Get all requests (with optional filters)
// @route   GET /api/requests
// @access  Public
const getRequests = async (req, res) => {
  try {
    const { bloodGroup, district, city, urgency, status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open'; // default to open requests
    }

    const bGroup = bloodGroup;
    if (bGroup) {
      filter.$or = [{ bloodType: bGroup }, { bloodGroupNeeded: bGroup }];
    }

    const loc = district || city;
    if (loc) {
      filter.$or = filter.$or
        ? filter.$or
        : [{ district: new RegExp(loc, 'i') }, { city: new RegExp(loc, 'i') }];
    }

    if (urgency) {
      filter.urgency = new RegExp(urgency, 'i');
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 });

    // Custom sorting: Critical > Urgent > Normal
    const urgencyPriority = {
      Critical: 1, critical: 1,
      Urgent: 2, urgent: 2,
      Normal: 3, normal: 3
    };

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
    console.error('Get Requests Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving requests',
      error: error.message
    });
  }
};

// @desc    Update request status (fulfilled/expired)
// @route   PATCH /api/requests/:id
// @access  Public / Protected
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'fulfilled', 'expired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be open, fulfilled, or expired.'
      });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    console.error('Update Request Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating request status',
      error: error.message
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};
