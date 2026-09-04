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

// @desc    Full update of a blood request (Edit fields)
// @route   PUT /api/requests/:id
// @access  Public / Protected
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
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
      status,
      expiresAt
    } = req.body;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const bType = bloodType || bloodGroupNeeded || request.bloodType;
    const locDistrict = district || city || request.district;
    const hosp = patientHospital || hospital || request.hospital;

    request.patientHospital = hosp;
    request.patientName = patientName || request.patientName;
    request.hospital = hosp;
    request.bloodType = bType;
    request.bloodGroupNeeded = bType;
    request.unitsNeeded = unitsNeeded !== undefined ? unitsNeeded : request.unitsNeeded;
    request.urgency = urgency || request.urgency;
    request.district = locDistrict;
    request.city = locDistrict;
    if (status) request.status = status;
    if (expiresAt !== undefined) request.expiresAt = expiresAt;

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update Request Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating blood request',
      error: error.message
    });
  }
};

// @desc    Delete a blood request
// @route   DELETE /api/requests/:id
// @access  Public / Protected
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    await Request.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully',
      id
    });
  } catch (error) {
    console.error('Delete Request Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting blood request',
      error: error.message
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  updateRequest,
  deleteRequest
};
