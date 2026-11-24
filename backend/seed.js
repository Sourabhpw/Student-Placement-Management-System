const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Models
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const PlacementDrive = require('./models/PlacementDrive');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await PlacementDrive.deleteMany();

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);
    const recruiterHash = await bcrypt.hash('Recruiter@123', salt);
    const studentHash = await bcrypt.hash('Student@123', salt);

    // 1. Admin
    const adminUser = await User.create({
      name: 'Dr. Suresh Sharma (Admin)',
      email: 'admin@college.edu',
      password: passwordHash,
      role: 'admin',
      phone: '+91 9876543210',
    });

    // 2. Recruiters
    const recruiter1 = await User.create({
      name: 'Priya Mehta',
      email: 'recruiter@infosys.com',
      password: recruiterHash,
      role: 'recruiter',
      phone: '+91 9876543211',
    });

    const recruiter2 = await User.create({
      name: 'Rohan Gupta',
      email: 'careers@google.com',
      password: recruiterHash,
      role: 'recruiter',
      phone: '+91 9876543212',
    });

    const recruiter3 = await User.create({
      name: 'Ananya Roy',
      email: 'hr@microsoft.com',
      password: recruiterHash,
      role: 'recruiter',
      phone: '+91 9876543213',
    });

    // 3. Students
    const studentUser1 = await User.create({
      name: 'Sourabh Sharma',
      email: 'sourabh@student.edu',
      password: studentHash,
      role: 'student',
      phone: '+91 9876543220',
    });

    const studentUser2 = await User.create({
      name: 'Aakash Verma',
      email: 'aakash@student.edu',
      password: studentHash,
      role: 'student',
      phone: '+91 9876543221',
    });

    const studentUser3 = await User.create({
      name: 'Sneha Patel',
      email: 'sneha@student.edu',
      password: studentHash,
      role: 'student',
      phone: '+91 9876543222',
    });

    // 4. Companies
    const company1 = await Company.create({
      name: 'Infosys Limited',
      recruiter: recruiter1._id,
      industry: 'IT Services & Consulting',
      location: 'Bangalore / Pune / Hyderabad',
      website: 'https://www.infosys.com',
      contactEmail: 'recruiter@infosys.com',
      contactPhone: '+91 9876543211',
      description: 'A global leader in next-generation digital services and consulting.',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    });

    const company2 = await Company.create({
      name: 'Google India',
      recruiter: recruiter2._id,
      industry: 'Product & Cloud Computing',
      location: 'Bangalore / Hyderabad',
      website: 'https://careers.google.com',
      contactEmail: 'careers@google.com',
      contactPhone: '+91 9876543212',
      description: 'Google’s mission is to organize the world’s information and make it universally accessible.',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    });

    const company3 = await Company.create({
      name: 'Microsoft India',
      recruiter: recruiter3._id,
      industry: 'Software & Cloud Services',
      location: 'Noida / Hyderabad / Bangalore',
      website: 'https://careers.microsoft.com',
      contactEmail: 'hr@microsoft.com',
      contactPhone: '+91 9876543213',
      description: 'Empowering every person and every organization on the planet to achieve more.',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    });

    // 5. Students Profiles
    const student1 = await Student.create({
      user: studentUser1._id,
      rollNumber: 'MCA2024001',
      department: 'Computer Applications',
      course: 'MCA',
      batchYear: 2026,
      gender: 'Male',
      academicDetails: {
        tenthPercentage: 88.5,
        twelfthPercentage: 84.0,
        graduationCgpa: 8.6,
        activeBacklogs: 0,
        historyOfBacklogs: 0,
      },
      skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python'],
      certifications: [
        { title: 'Full Stack Web Development', issuer: 'Coursera', issueYear: 2025 },
        { title: 'MongoDB Certified Developer Associate', issuer: 'MongoDB Inc.', issueYear: 2025 },
      ],
      linkedinUrl: 'https://linkedin.com/in/sourabh-sharma-dev',
      githubUrl: 'https://github.com/sourabh-sharma',
      placementStatus: 'Placed',
      placedCompany: company1._id,
      placedPackageLPA: 9.5,
    });

    const student2 = await Student.create({
      user: studentUser2._id,
      rollNumber: 'MCA2024002',
      department: 'Computer Applications',
      course: 'MCA',
      batchYear: 2026,
      gender: 'Male',
      academicDetails: {
        tenthPercentage: 76.0,
        twelfthPercentage: 72.5,
        graduationCgpa: 7.8,
        activeBacklogs: 0,
        historyOfBacklogs: 1,
      },
      skills: ['Java', 'Spring Boot', 'MySQL', 'Data Structures', 'Git'],
      certifications: [
        { title: 'Oracle Certified Java SE 11', issuer: 'Oracle', issueYear: 2024 },
      ],
      linkedinUrl: 'https://linkedin.com/in/aakash-verma',
      githubUrl: 'https://github.com/aakash-verma',
      placementStatus: 'Unplaced',
    });

    const student3 = await Student.create({
      user: studentUser3._id,
      rollNumber: 'MCA2024003',
      department: 'Computer Applications',
      course: 'MCA',
      batchYear: 2026,
      gender: 'Female',
      academicDetails: {
        tenthPercentage: 92.0,
        twelfthPercentage: 91.0,
        graduationCgpa: 9.2,
        activeBacklogs: 0,
        historyOfBacklogs: 0,
      },
      skills: ['React.js', 'TypeScript', 'Next.js', 'TailwindCSS', 'AWS'],
      certifications: [
        { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', issueYear: 2025 },
      ],
      linkedinUrl: 'https://linkedin.com/in/sneha-patel',
      githubUrl: 'https://github.com/sneha-patel',
      placementStatus: 'Unplaced',
    });

    // 6. Jobs
    const job1 = await Job.create({
      title: 'Full Stack Software Engineer',
      company: company1._id,
      postedBy: recruiter1._id,
      description: 'We are seeking passionate Full Stack Developers with solid JavaScript, Node.js and React expertise to join our Digital transformation team.',
      roleCategory: 'Full Time',
      location: 'Bangalore, India',
      packageLPA: 9.5,
      openings: 5,
      eligibility: {
        minCgpa: 7.0,
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        maxBacklogs: 0,
        allowedBranches: ['MCA', 'B.Tech CS', 'IT'],
        allowedBatches: [2025, 2026],
      },
      requiredSkills: ['Node.js', 'React.js', 'MongoDB', 'REST APIs', 'Git'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'Active',
    });

    const job2 = await Job.create({
      title: 'Associate Cloud Software Engineer',
      company: company2._id,
      postedBy: recruiter2._id,
      description: 'Join Google Cloud engineering team to build highly scalable backend microservices, real-time distributed systems and cloud infrastructure tools.',
      roleCategory: 'Full Time',
      location: 'Hyderabad, India',
      packageLPA: 22.0,
      openings: 3,
      eligibility: {
        minCgpa: 8.0,
        minTenthPercentage: 75,
        minTwelfthPercentage: 75,
        maxBacklogs: 0,
        allowedBranches: ['MCA', 'B.Tech CS'],
        allowedBatches: [2026],
      },
      requiredSkills: ['Data Structures', 'Algorithms', 'Go / Java / Python', 'System Design'],
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'Active',
    });

    const job3 = await Job.create({
      title: 'Frontend Developer Intern',
      company: company3._id,
      postedBy: recruiter3._id,
      description: 'Exciting 6-month internship with potential PPO. Work on modern web applications, accessible user experiences and Microsoft 365 web apps.',
      roleCategory: 'Internship',
      location: 'Noida / Remote',
      packageLPA: 6.0,
      openings: 4,
      eligibility: {
        minCgpa: 6.5,
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        maxBacklogs: 1,
        allowedBranches: ['MCA', 'BCA', 'B.Tech CS'],
        allowedBatches: [2026, 2027],
      },
      requiredSkills: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'Active',
    });

    // 7. Applications
    await Application.create({
      job: job1._id,
      student: student1._id,
      company: company1._id,
      status: 'Selected',
      coverLetter: 'I have extensive hands-on experience in MERN stack development and built multiple scalable projects.',
      recruiterNotes: 'Exceptional performance in technical interview round and problem solving.',
      statusHistory: [
        { status: 'Applied', comment: 'Application submitted' },
        { status: 'Shortlisted', comment: 'Profile shortlisted for technical round' },
        { status: 'Interviewing', comment: 'Technical and HR interviews cleared' },
        { status: 'Selected', comment: 'Offer letter released at 9.5 LPA' },
      ],
    });

    await Application.create({
      job: job2._id,
      student: student3._id,
      company: company2._id,
      status: 'Shortlisted',
      coverLetter: 'Passionate about distributed cloud systems, high performance computing and algorithms.',
      recruiterNotes: 'Impressive CGPA and cloud certifications. Shortlisted for Round 1 assessment.',
      statusHistory: [
        { status: 'Applied', comment: 'Application submitted' },
        { status: 'Shortlisted', comment: 'Invited for Google online coding challenge' },
      ],
    });

    await Application.create({
      job: job1._id,
      student: student2._id,
      company: company1._id,
      status: 'Applied',
      coverLetter: 'Strong fundamentals in backend development and databases.',
      statusHistory: [
        { status: 'Applied', comment: 'Application submitted under review' },
      ],
    });

    // 8. Placement Drives
    await PlacementDrive.create({
      title: 'Infosys Annual Campus Recruitment 2026',
      company: company1._id,
      driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Main Auditorium, Campus Block A',
      driveType: 'On-Campus',
      description: 'Online aptitude assessment followed by technical and HR interview rounds in campus labs.',
      eligibleCourses: ['MCA', 'B.Tech CS', 'IT'],
      status: 'Upcoming',
      createdBy: adminUser._id,
    });

    await PlacementDrive.create({
      title: 'Google STEP & University Hiring Drive',
      company: company2._id,
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: 'Virtual (Google Meet)',
      driveType: 'Virtual',
      description: 'Virtual technical interview sessions for shortlisted candidates.',
      eligibleCourses: ['MCA', 'B.Tech CS'],
      status: 'Upcoming',
      createdBy: adminUser._id,
    });

    console.log('[Seed] Database seeded successfully with demo users, companies, jobs, drives, and applications!');
    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Admin:     admin@college.edu       / Admin@123');
    console.log('Recruiter: recruiter@infosys.com   / Recruiter@123');
    console.log('Student:   sourabh@student.edu     / Student@123');
    console.log('Student 2: aakash@student.edu      / Student@123');
    console.log('--------------------------------------------------');
    
    // If running as standalone script, we don't exit if memory server is keeping it alive or we exit 0
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
