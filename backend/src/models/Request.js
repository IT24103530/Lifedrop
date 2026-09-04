const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    patientHospital: {
      type: String,
      required: [true, 'Patient or Hospital name is required'],
      trim: true
    },
    patientName: {
      type: String,
      trim: true
    },
    hospital: {
      type: String,
      trim: true
    },
    bloodType: {
      type: String,
      required: [true, 'Blood type is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    bloodGroupNeeded: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unitsNeeded: {
      type: Number,
      default: 1
    },
    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: ['Critical', 'Urgent', 'Normal', 'critical', 'urgent', 'normal'],
      default: 'Normal'
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired'],
      default: 'open'
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure legacy and new field names stay in sync
requestSchema.pre('save', function (next) {
  if (!this.bloodGroupNeeded && this.bloodType) {
    this.bloodGroupNeeded = this.bloodType;
  }
  if (!this.bloodType && this.bloodGroupNeeded) {
    this.bloodType = this.bloodGroupNeeded;
  }
  if (!this.city && this.district) {
    this.city = this.district;
  }
  if (!this.district && this.city) {
    this.district = this.city;
  }
  if (!this.hospital && this.patientHospital) {
    this.hospital = this.patientHospital;
  }
  if (!this.patientHospital && this.hospital) {
    this.patientHospital = this.hospital;
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema);
