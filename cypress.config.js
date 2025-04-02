const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  projectId: '4askfu',
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: true, // Enable video recording
    screenshotOnRunFailure: true, // Capture screenshots for failed tests
    setupNodeEvents(on, config) {
      on('after:run', () => {
        try {
          const testReport = JSON.parse(
            fs.readFileSync('cypress/report/mochawesome.json', 'utf8')
          );
          console.log('Test Report:', testReport);
        } catch (error) {
          console.error('Error reading test report:', error);
        }
      });
    },
  },
});
