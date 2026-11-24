const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function verifyAll() {
  console.log('\n--- EXECUTING LIVE MANUAL VERIFICATION WORKFLOWS ---\n');

  // 1. Verify Login: Admin
  console.log('1. Testing Admin Login...');
  const adminLogin = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@college.edu', password: 'Admin@123' }
  );
  if (adminLogin.status !== 200 || adminLogin.data.user.role !== 'admin') {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.data));
  }
  const adminToken = adminLogin.data.token;
  console.log('   ✓ Admin Login Success: Verified role "admin" for', adminLogin.data.user.email);

  // 2. Verify Login: Recruiter
  console.log('2. Testing Recruiter Login...');
  const recruiterLogin = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'recruiter@infosys.com', password: 'Recruiter@123' }
  );
  if (recruiterLogin.status !== 200 || recruiterLogin.data.user.role !== 'recruiter') {
    throw new Error('Recruiter login failed');
  }
  const recruiterToken = recruiterLogin.data.token;
  console.log('   ✓ Recruiter Login Success: Verified role "recruiter" for', recruiterLogin.data.user.email);

  // 3. Verify Login: Student
  console.log('3. Testing Existing Student Login...');
  const studentLogin = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'sourabh@student.edu', password: 'Student@123' }
  );
  if (studentLogin.status !== 200 || studentLogin.data.user.role !== 'student') {
    throw new Error('Student login failed');
  }
  console.log('   ✓ Student Login Success: Verified role "student" for', studentLogin.data.user.email);

  // 4. Test Complete Student Registration & Login Journey
  console.log('4. Testing Complete New Student Registration & Login Journey...');
  const uniqueRoll = `MCA${Date.now().toString().slice(-5)}`;
  const uniqueEmail = `student_${Date.now()}@college.edu`;
  const registerRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Pooja Kashyap',
      email: uniqueEmail,
      password: 'Student@123',
      role: 'student',
      phone: '+91 9123456780',
      rollNumber: uniqueRoll,
      department: 'Computer Applications',
      course: 'MCA',
      batchYear: 2026,
      graduationCgpa: 8.85,
      tenthPercentage: 85,
      twelfthPercentage: 82,
      skills: 'React.js, Node.js, Express, MongoDB, Java',
    }
  );
  if (registerRes.status !== 201 || !registerRes.data.token) {
    throw new Error('Student registration failed: ' + JSON.stringify(registerRes.data));
  }
  const newStudentToken = registerRes.data.token;
  console.log('   ✓ Student Registration Success: Registered', uniqueEmail, 'with Roll:', uniqueRoll);

  // Verify new student can login
  const newStudentLogin = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: uniqueEmail, password: 'Student@123' }
  );
  if (newStudentLogin.status !== 200) {
    throw new Error('New student login check failed');
  }
  console.log('   ✓ New Student Login Verified: Authenticated with JWT');

  // 5. Test Company and Job Creation by Recruiter
  console.log('5. Testing Company & Job Creation...');
  const newJobRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/jobs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
    },
    {
      title: 'Full Stack Cloud Architect',
      roleCategory: 'Full Time',
      location: 'Pune, India',
      packageLPA: 12.0,
      openings: 4,
      eligibility: {
        minCgpa: 7.0,
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
        maxBacklogs: 0,
        allowedBranches: ['MCA', 'B.Tech CS'],
      },
      requiredSkills: 'Node.js, React.js, AWS, MongoDB',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Building next-generation distributed enterprise applications.',
      status: 'Active',
    }
  );
  if (newJobRes.status !== 201 || !newJobRes.data.data._id) {
    throw new Error('Job creation failed: ' + JSON.stringify(newJobRes.data));
  }
  const createdJobId = newJobRes.data.data._id;
  console.log('   ✓ Job Creation Success: Created opening ID', createdJobId);

  // 6. Test Student Job Application
  console.log('6. Testing Student Job Application...');
  const applyRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/applications/apply/${createdJobId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newStudentToken}`,
      },
    },
    { coverLetter: 'Enthusiastic about distributed cloud solutions and MERN stack.' }
  );
  if (applyRes.status !== 201 || !applyRes.data.data._id) {
    throw new Error('Student apply failed: ' + JSON.stringify(applyRes.data));
  }
  const applicationId = applyRes.data.data._id;
  console.log('   ✓ Job Application Success: Submitted application ID', applicationId);

  // 7. Test Recruiter Application Status Update
  console.log('7. Testing Recruiter Application Status Update...');
  const statusUpdateRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/applications/${applicationId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
    },
    { status: 'Interviewing', notes: 'Scheduled for Technical Round 1 on Google Meet' }
  );
  if (statusUpdateRes.status !== 200 || statusUpdateRes.data.data.status !== 'Interviewing') {
    throw new Error('Recruiter status update failed: ' + JSON.stringify(statusUpdateRes.data));
  }
  console.log('   ✓ Application Status Update Success: Moved to status "Interviewing" with recruiter feedback');

  // 8. Test Data Query directly from MongoDB via REST API
  console.log('8. Verifying Data Flow from MongoDB to Frontend Endpoints...');
  const myAppsRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/applications/my',
    method: 'GET',
    headers: { Authorization: `Bearer ${newStudentToken}` },
  });
  if (myAppsRes.status !== 200 || myAppsRes.data.count < 1) {
    throw new Error('Failed to retrieve student applications from DB');
  }
  const retrievedApp = myAppsRes.data.data[0];
  console.log('   ✓ Verified MongoDB REST Flow: Student retrieved active application:');
  console.log('     - Job:', retrievedApp.job?.title);
  console.log('     - Status:', retrievedApp.status);
  console.log('     - Recruiter Feedback:', retrievedApp.recruiterNotes);
  console.log('     - Status History count:', retrievedApp.statusHistory?.length);

  console.log('\n--- ALL MANUAL VERIFICATION STEPS PASSED SUCCESSFULLY ---\n');
}

verifyAll().catch((err) => {
  console.error('\n✗ Verification Failed:', err.message);
  process.exit(1);
});
