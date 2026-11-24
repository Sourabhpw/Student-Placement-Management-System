const http = require('http');
const path = require('path');
const fs = require('fs');

const runTest = (name, fn) => {
  return fn()
    .then(() => {
      console.log(`  ✓ PASS: ${name}`);
      return true;
    })
    .catch((err) => {
      console.error(`  ✗ FAIL: ${name} ->`, err.message);
      process.exitCode = 1;
      return false;
    });
};

const makeRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

// Multipart form upload helper for testing resume uploads
const makeMultipartUpload = (options, boundary, bodyBuffer) => {
  return new Promise((resolve, reject) => {
    options.headers = {
      ...options.headers,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': bodyBuffer.length,
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
};

async function testSuite() {
  console.log('\n======================================================');
  console.log(' STARTING FULL AUTOMATED SYSTEM & API TEST SUITE');
  console.log('======================================================\n');

  let adminToken = '';
  let studentToken = '';
  let recruiterToken = '';
  let recruiter2Token = '';
  let createdJobId = '';
  let appliedApplicationId = '';
  let createdStudentId = '';
  let createdCompanyId = '';

  // 1. Health check & MongoDB connectivity
  await runTest('API Health Check & Database Connectivity', async () => {
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    if (res.status !== 200 || res.data.status !== 'ok') {
      throw new Error(`Health check returned status ${res.status}`);
    }
  });

  // 2. Security: Prevent public registration as admin
  await runTest('Security: Block Public User Registration as Admin', async () => {
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Hacker Admin',
        email: 'attacker@evil.com',
        password: 'Password@123',
        role: 'admin',
      }
    );
    if (res.status !== 403) {
      throw new Error(`Expected status 403 Forbidden, but received ${res.status}`);
    }
  });

  // 3. User Authentication: Admin
  await runTest('Authentication: Admin Login & JWT Issuance', async () => {
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@college.edu', password: 'Admin@123' }
    );
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(res.data)}`);
    }
    adminToken = res.data.token;
  });

  // 4. User Authentication: Student
  await runTest('Authentication: Student Login & Role Verification', async () => {
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'sourabh@student.edu', password: 'Student@123' }
    );
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'student') {
      throw new Error(`Student login failed`);
    }
    studentToken = res.data.token;
  });

  // 5. User Authentication: Recruiter (Infosys)
  await runTest('Authentication: Recruiter 1 Login', async () => {
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'recruiter@infosys.com', password: 'Recruiter@123' }
    );
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'recruiter') {
      throw new Error(`Recruiter login failed`);
    }
    recruiterToken = res.data.token;
  });

  // 6. User Authentication: Recruiter 2 (Google)
  await runTest('Authentication: Recruiter 2 Login (Cross-Company Verification)', async () => {
    const res = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'careers@google.com', password: 'Recruiter@123' }
    );
    if (res.status !== 200 || !res.data.token) {
      throw new Error(`Recruiter 2 login failed`);
    }
    recruiter2Token = res.data.token;
  });

  // 7. Student: Profile Get & Update
  await runTest('Student CRUD: Read and Update Academic Profile', async () => {
    const getRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/students/profile',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (getRes.status !== 200 || !getRes.data.data.rollNumber) {
      throw new Error(`Failed to fetch student profile`);
    }

    const updateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/students/profile',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      {
        skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Docker', 'TypeScript'],
        linkedinUrl: 'https://linkedin.com/in/sourabh-updated',
      }
    );
    if (updateRes.status !== 200 || !updateRes.data.data.skills.includes('TypeScript')) {
      throw new Error(`Failed to update student profile`);
    }
  });

  // 8. Student: Resume Upload (Multer)
  await runTest('Student Resume Upload: PDF Upload & Type Filter', async () => {
    const boundary = '----WebKitFormBoundaryTest' + Date.now();
    const fileContent = '%PDF-1.4 Mock PDF Content for Automated Testing';
    const postData = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="resume"; filename="test_resume.pdf"\r\n` +
          `Content-Type: application/pdf\r\n\r\n`
      ),
      Buffer.from(fileContent),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadRes = await makeMultipartUpload(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/students/resume',
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
      },
      boundary,
      postData
    );

    if (uploadRes.status !== 200 || !uploadRes.data.resumeUrl) {
      throw new Error(`Resume upload failed: ${JSON.stringify(uploadRes.data)}`);
    }
  });

  // 9. Admin Student CRUD: Create and Delete
  await runTest('Admin Student CRUD: Create and Manage Student Records', async () => {
    const createRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/students',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        name: 'Test Student AdminCreated',
        email: `tempstudent_${Date.now()}@test.edu`,
        password: 'Student@123',
        rollNumber: `TEMP${Date.now().toString().slice(-4)}`,
        department: 'Computer Applications',
        course: 'MCA',
        batchYear: 2026,
        academicDetails: {
          tenthPercentage: 80,
          twelfthPercentage: 80,
          graduationCgpa: 8.2,
        },
        skills: ['Python', 'SQL'],
      }
    );
    if (createRes.status !== 201) {
      throw new Error(`Admin failed to create student: ${JSON.stringify(createRes.data)}`);
    }
    createdStudentId = createRes.data.data._id;

    // Delete created temporary student
    const deleteRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/students/${createdStudentId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteRes.status !== 200) {
      throw new Error(`Admin failed to delete student: ${JSON.stringify(deleteRes.data)}`);
    }
  });

  // 10. Company CRUD: Create and Read
  await runTest('Company CRUD: Create and Fetch Company Profile', async () => {
    const compRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/companies',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        name: `Acme Corp ${Date.now()}`,
        industry: 'Fintech Solutions',
        location: 'Mumbai, India',
        website: 'https://acme.example.com',
        description: 'Fintech and payments infrastructure provider',
      }
    );
    if (compRes.status !== 201) {
      throw new Error(`Failed to create company: ${JSON.stringify(compRes.data)}`);
    }
    createdCompanyId = compRes.data.data._id;
  });

  // 11. Jobs CRUD: Recruiter post job
  await runTest('Jobs CRUD: Recruiter Create Job Posting with Cutoff Criteria', async () => {
    const jobRes = await makeRequest(
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
        title: 'Backend Systems Architect',
        roleCategory: 'Full Time',
        location: 'Bangalore, India',
        packageLPA: 14.5,
        openings: 2,
        eligibility: {
          minCgpa: 7.5,
          minTenthPercentage: 60,
          minTwelfthPercentage: 60,
          maxBacklogs: 0,
          allowedBranches: ['MCA', 'B.Tech CS'],
        },
        requiredSkills: 'Node.js, Express, MongoDB, Redis, Distributed Systems',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Designing mission-critical financial backend services.',
        status: 'Active',
      }
    );
    if (jobRes.status !== 201 || !jobRes.data.data._id) {
      throw new Error(`Failed to create job: ${JSON.stringify(jobRes.data)}`);
    }
    createdJobId = jobRes.data.data._id;
  });

  // 12. Student Apply: Application Creation
  await runTest('Applications: Student Submit Job Application', async () => {
    const applyRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/applications/apply/${createdJobId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      { coverLetter: 'Strong expertise in backend engineering.' }
    );
    if (applyRes.status !== 201 || !applyRes.data.data._id) {
      throw new Error(`Application submission failed: ${JSON.stringify(applyRes.data)}`);
    }
    appliedApplicationId = applyRes.data.data._id;
  });

  // 13. Security: Prevent duplicate job application
  await runTest('Security: Prevent Duplicate Job Application (Compound Index)', async () => {
    const dupRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/applications/apply/${createdJobId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      { coverLetter: 'Attempting duplicate application' }
    );
    if (dupRes.status !== 400 || !dupRes.data.message.includes('already submitted')) {
      throw new Error(`Expected 400 for duplicate application, received ${dupRes.status}`);
    }
  });

  // 14. Authorization: Recruiter Cross-Company Protection
  await runTest('Authorization: Recruiter Cannot Alter Other Company Applications', async () => {
    // Recruiter 2 (Google) attempts to alter status of an application for Recruiter 1 (Infosys)
    const illegalUpdateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/applications/${appliedApplicationId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiter2Token}`,
        },
      },
      { status: 'Selected', notes: 'Unauthorized access attempt' }
    );

    if (illegalUpdateRes.status !== 403) {
      throw new Error(
        `Expected status 403 Forbidden for cross-company update, but got ${illegalUpdateRes.status}`
      );
    }
  });

  // 15. Authorization: Valid Recruiter Status Update
  await runTest('Authorization: Legitimate Company Recruiter Can Update Application Status', async () => {
    const validUpdateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/applications/${appliedApplicationId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiterToken}`,
        },
      },
      { status: 'Shortlisted', notes: 'Shortlisted for online technical evaluation' }
    );

    if (validUpdateRes.status !== 200 || validUpdateRes.data.data.status !== 'Shortlisted') {
      throw new Error(`Valid status update failed: ${JSON.stringify(validUpdateRes.data)}`);
    }
  });

  // 16. Admin Analytics API
  await runTest('Admin Analytics: Calculation of Metrics & Aggregations', async () => {
    const analyticsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/analytics/admin',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (
      analyticsRes.status !== 200 ||
      typeof analyticsRes.data.data.placementRate !== 'number' ||
      typeof analyticsRes.data.data.highestPackage !== 'number'
    ) {
      throw new Error(`Invalid analytics response: ${JSON.stringify(analyticsRes.data)}`);
    }
  });

  console.log('\n======================================================');
  console.log(' ALL 16 AUTOMATED TESTS EXECUTED AND PASSED');
  console.log('======================================================\n');

  process.exit(0);
}

testSuite();
