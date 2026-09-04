const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donor = require('../models/Donor');
const Request = require('../models/Request');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifedrop';

// Date math helper (months ago)
const getPastDate = (monthsAgo) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d;
};

const sampleDonors = [
  {
    name: 'Kasun Perera',
    bloodType: 'O+',
    district: 'Jaffna',
    phone: '0771234567',
    lastDonationDate: getPastDate(5) // Eligible (5 months ago)
  },
  {
    name: 'Sinnathamby Thennavan',
    bloodType: 'A+',
    district: 'Jaffna',
    phone: '0712345678',
    lastDonationDate: getPastDate(2) // Ineligible (2 months ago)
  },
  {
    name: 'Kavindi Fernando',
    bloodType: 'B+',
    district: 'Kilinochchi',
    phone: '0753456789',
    lastDonationDate: getPastDate(6) // Eligible
  },
  {
    name: 'Mohamed Rizwan',
    bloodType: 'O-',
    district: 'Colombo',
    phone: '0764567890',
    lastDonationDate: getPastDate(1) // Ineligible
  },
  {
    name: 'Tharindu Jayasinghe',
    bloodType: 'AB+',
    district: 'Kandy',
    phone: '0785678901',
    lastDonationDate: getPastDate(4) // Eligible (4 months exact)
  },
  {
    name: 'Priyanka Kulasinghe',
    bloodType: 'A-',
    district: 'Kilinochchi',
    phone: '0706789012',
    lastDonationDate: getPastDate(8) // Eligible
  },
  {
    name: 'Vimalan Nathan',
    bloodType: 'B-',
    district: 'Jaffna',
    phone: '0727890123',
    lastDonationDate: getPastDate(3) // Ineligible
  },
  {
    name: 'Nuwan Wijesinghe',
    bloodType: 'O+',
    district: 'Gampaha',
    phone: '0748901234',
    lastDonationDate: getPastDate(12) // Eligible
  },
  {
    name: 'Dilini Bandara',
    bloodType: 'AB-',
    district: 'Galle',
    phone: '0779012345',
    lastDonationDate: getPastDate(0.5) // Ineligible (2 weeks ago)
  },
  {
    name: 'Santhush Wickramaratne',
    bloodType: 'A+',
    district: 'Kurunegala',
    phone: '0710123456',
    lastDonationDate: getPastDate(5) // Eligible
  },
  {
    name: 'Anuradha Senanayake',
    bloodType: 'B+',
    district: 'Anuradhapura',
    phone: '0751234567',
    lastDonationDate: getPastDate(7) // Eligible
  },
  {
    name: 'Lakshan Silva',
    bloodType: 'O+',
    district: 'Colombo',
    phone: '0762345678',
    lastDonationDate: getPastDate(2.5) // Ineligible
  },
  {
    name: 'Niroshani Kumar',
    bloodType: 'A+',
    district: 'Jaffna',
    phone: '0783456789',
    lastDonationDate: getPastDate(10) // Eligible
  },
  {
    name: 'Subashini Kanagaratnam',
    bloodType: 'O-',
    district: 'Kilinochchi',
    phone: '0704567890',
    lastDonationDate: getPastDate(4.5) // Eligible
  },
  {
    name: 'Buddhika Rathnayake',
    bloodType: 'B-',
    district: 'Kandy',
    phone: '0725678901',
    lastDonationDate: getPastDate(1) // Ineligible
  },
  {
    name: 'Nadeesha Herath',
    bloodType: 'AB+',
    district: 'Gampaha',
    phone: '0746789012',
    lastDonationDate: getPastDate(9) // Eligible
  }
];

const sampleRequests = [
  {
    patientHospital: 'Jaffna Teaching Hospital - ICU Bed 4',
    bloodType: 'O-',
    urgency: 'Critical',
    district: 'Jaffna'
  },
  {
    patientHospital: 'Kilinochchi District General Hospital',
    bloodType: 'A+',
    urgency: 'Critical',
    district: 'Kilinochchi'
  },
  {
    patientHospital: 'National Hospital Colombo - Emergency Ward 2',
    bloodType: 'B+',
    urgency: 'Urgent',
    district: 'Colombo'
  },
  {
    patientHospital: 'Tellippalai Cancer Hospital',
    bloodType: 'AB-',
    urgency: 'Urgent',
    district: 'Jaffna'
  },
  {
    patientHospital: 'Kandy General Hospital - Maternity Ward',
    bloodType: 'O+',
    urgency: 'Normal',
    district: 'Kandy'
  },
  {
    patientHospital: 'Galle Karapitiya Teaching Hospital',
    bloodType: 'A-',
    urgency: 'Normal',
    district: 'Galle'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed]: Connected to MongoDB');

    await Donor.deleteMany({});
    await Request.deleteMany({});
    console.log('[Seed]: Cleared existing Donors and Requests');

    const createdDonors = await Donor.insertMany(sampleDonors);
    console.log(`[Seed]: Inserted ${createdDonors.length} donors successfully`);

    const createdRequests = await Request.insertMany(sampleRequests);
    console.log(`[Seed]: Inserted ${createdRequests.length} blood requests successfully`);

    console.log('[Seed]: Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
