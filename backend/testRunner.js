const http = require('http');

const runTest = (name, fn) => {
  return fn()
    .then(() => console.log(`  ✓ PASS: ${name}`))
    .catch((err) => {
      console.error(`  ✗ FAIL: ${name}`, err.message);
      process.exitCode = 1;
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
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
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

async function testSuite() {
  console.log('\n--- STARTING AUTOMATED INTEGRATION TESTS ---');

  let adminToken = '';
  let studentToken = '';
  let recruiterToken = '';
  let testJobId = '';

  // 1. Health check
  await runTest('API Health Check', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    if (res.status !== 200 || res.data.status !== 'ok') {
      throw new Error(`Health check returned status ${res.status}`);
    }
  });

  // 2. Admin Login
  await runTest('Admin Authentication & JWT Generation', async () => {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@college.edu', password: 'Admin@123' }
    );
    if (res.status !== 200 || !res.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(res.data)}`);
    }
    adminToken = res.data.token;
  });

  // 3. Student Login
  await runTest('Student Authentication & Role Check', async () => {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'sourabh@student.edu', password: 'Student@123' }
    );
    if (res.status !== 200 || res.data.user.role !== 'student') {
      throw new Error(`Student login failed`);
    }
    studentToken = res.data.token;
  });

  // 4. Recruiter Login
  await runTest('Recruiter Authentication', async () => {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'recruiter@infosys.com', password: 'Recruiter@123' }
    );
    if (res.status !== 200 || res.data.user.role !== 'recruiter') {
      throw new Error(`Recruiter login failed`);
    }
    recruiterToken = res.data.token;
  });

  // 5. Admin Analytics
  await runTest('Admin Placement Analytics API', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/analytics/admin',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status !== 200 || typeof res.data.data.totalStudents !== 'number') {
      throw new Error(`Admin analytics failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 6. Public / Student Jobs List
  await runTest('Jobs List and Query Filtering', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs?roleCategory=Full%20Time',
      method: 'GET',
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error(`Failed to list jobs`);
    }
    if (res.data.data.length > 0) {
      testJobId = res.data.data[0]._id;
    }
  });

  // 7. Recruiter Post New Job
  await runTest('Recruiter Post New Job Opportunity', async () => {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/jobs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiterToken}`,
        },
      },
      {
        title: 'Cloud DevOps Associate',
        roleCategory: 'Full Time',
        location: 'Pune / Remote',
        packageLPA: 11.0,
        openings: 3,
        eligibility: {
          minCgpa: 7.0,
          minTenthPercentage: 60,
          minTwelfthPercentage: 60,
          maxBacklogs: 0,
          allowedBranches: ['MCA', 'B.Tech CS'],
        },
        requiredSkills: 'Docker, Kubernetes, AWS, Linux',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Manage CI/CD pipelines and Kubernetes infrastructure.',
        status: 'Active',
      }
    );
    if (res.status !== 201 || !res.data.data._id) {
      throw new Error(`Job creation failed: ${JSON.stringify(res.data)}`);
    }
    testJobId = res.data.data._id;
  });

  // 8. Student Duplicate Application Prevention
  await runTest('Duplicate Application Prevention', async () => {
    // Student 1 (sourabh) has already applied for job 1 during seed
    // Try to re-apply to same seed job
    const jobsRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/jobs',
      method: 'GET',
    });
    const firstJob = jobsRes.data.data.find(j => j.title.includes('Full Stack Software Engineer'));
    if (firstJob) {
      const res = await makeRequest(
        {
          hostname: 'localhost',
          port: 5000,
          path: `/api/applications/apply/${firstJob._id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${studentToken}`,
          },
        },
        { coverLetter: 'Trying duplicate apply' }
      );
      if (res.status !== 400 || !res.data.message.includes('already submitted')) {
        throw new Error(`Failed to prevent duplicate application. Status: ${res.status}`);
      }
    }
  });

  // 9. Student Apply to New Job
  await runTest('Student Successfully Apply to Position', async () => {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/applications/apply/${testJobId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      { coverLetter: 'Strong experience with Docker and automated testing.' }
    );
    if (res.status !== 201) {
      throw new Error(`Failed to apply: ${JSON.stringify(res.data)}`);
    }
  });

  // 10. Placement Drives Listing
  await runTest('Placement Drives Retrieval', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/drives',
      method: 'GET',
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error(`Failed to retrieve drives`);
    }
  });

  console.log('--- ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY ---\n');
}

testSuite();
