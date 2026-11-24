const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      default: 'MCA',
      trim: true,
    },
    batchYear: {
      type: Number,
      required: [true, 'Batch / Passing year is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Male',
    },
    dob: {
      type: Date,
    },
    academicDetails: {
      tenthPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      twelfthPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      graduationCgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },
      activeBacklogs: {
        type: Number,
        default: 0,
      },
      historyOfBacklogs: {
        type: Number,
        default: 0,
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    certifications: [
      {
        title: { type: String, trim: true },
        issuer: { type: String, trim: true },
        issueYear: { type: Number },
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    placementStatus: {
      type: String,
      enum: ['Unplaced', 'Placed', 'Opted Out'],
      default: 'Unplaced',
    },
    placedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    placedPackageLPA: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
