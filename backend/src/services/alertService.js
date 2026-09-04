const User = require('../models/User');
const Notification = require('../models/Notification');
const { emitToUser, broadcastEvent } = require('../utils/socket');

const recipientDonorMap = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

const dispatchUrgentRequestAlert = async (requestDoc) => {
  try {
    const urgencyLower = (requestDoc.urgency || '').toLowerCase();
    const isUrgentOrCritical = urgencyLower === 'urgent' || urgencyLower === 'critical';

    // Broadcast new request event to all active feeds
    broadcastEvent('request-updated', { type: 'created', request: requestDoc });

    if (!isUrgentOrCritical) {
      return;
    }

    const bloodGroupNeeded = requestDoc.bloodGroupNeeded || requestDoc.bloodType;
    const compatibleBloodGroups = recipientDonorMap[bloodGroupNeeded] || [bloodGroupNeeded];

    const filter = {
      bloodGroup: { $in: compatibleBloodGroups },
      notificationPreference: true
    };

    if (requestDoc.requesterId) {
      filter._id = { $ne: requestDoc.requesterId };
    }

    const matchedUsers = await User.find(filter);

    const hospital = requestDoc.hospital || requestDoc.patientHospital || 'Local Hospital';
    const city = requestDoc.city || requestDoc.district || 'Location Specified';
    const message = `[${requestDoc.urgency.toUpperCase()} ALERT]: ${bloodGroupNeeded} blood urgently required at ${hospital} (${city}).`;

    const notificationPromises = matchedUsers.map(async (user) => {
      const notification = await Notification.create({
        userId: user._id,
        requestId: requestDoc._id,
        message,
        urgency: requestDoc.urgency,
        read: false
      });

      emitToUser(user._id.toString(), 'urgent-alert', notification);
      return notification;
    });

    await Promise.all(notificationPromises);
    console.log(`[Alert System]: Dispatched ${matchedUsers.length} urgent notifications for Request ${requestDoc._id}`);
  } catch (error) {
    console.error('[Alert System Error]: Failed to dispatch urgent alerts:', error);
  }
};

module.exports = {
  dispatchUrgentRequestAlert,
  recipientDonorMap
};
