module.exports = {
  rootDir: 'dist',
  testMatch: ['<rootDir>/**/tests/**/*.js'],
  preset: 'jest-puppeteer',
  bail: true,
  testResultsProcessor: 'jest-html-reporter'
};
