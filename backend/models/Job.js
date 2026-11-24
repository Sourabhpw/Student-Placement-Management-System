const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    roleCategory: {
      type: String,
      default: 'Full Time',
      enum: ['Full Time', 'Internship', 'Contract', 'Part Time'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    packageLPA: {
      type: Number,
      required: [true, 'Package (LPA) is required'],
      min: 0,
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 6.0,
      },
      minTenthPercentage: {
        type: Number,
        default: 60,
      },
      minTwelfthPercentage: {
        type: Number,
        default: 60,
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      allowedBranches: [
        {
          type: String,
          trim: true,
        },
      ],
      allowedBatches: [
        {
          type: Number,
        },
      ],
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
