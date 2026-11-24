const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Drive title is required'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    driveDate: {
      type: Date,
      required: [true, 'Drive date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue or online link is required'],
      trim: true,
    },
    driveType: {
      type: String,
      enum: ['On-Campus', 'Pool-Campus', 'Off-Campus', 'Virtual'],
      default: 'On-Campus',
    },
    description: {
      type: String,
      default: '',
    },
    eligibleCourses: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
