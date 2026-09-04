const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    bloodType: {
      type: String,
      required: [true, 'Blood type is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    lastDonationDate: {
      type: Date,
      required: [true, 'Last donation date is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Donor', donorSchema);
