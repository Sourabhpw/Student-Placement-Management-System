const app = require('./server');

const runAll = async () => {
  // Give server 1 second to bind to MongoDB
  await new Promise((r) => setTimeout(r, 1500));

  console.log('\n==================================================');
  console.log(' RUNNING IN-PROCESS FULL INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  require('./testRunner');
};

runAll();
