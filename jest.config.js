module.exports = {
  rootDir: 'dist',
  testMatch: ['<rootDir>/**/tests/**/*.js','**/?(*.)(spec|test).js'],
  preset: 'jest-puppeteer',
  bail: true
};
