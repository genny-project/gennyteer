module.exports = {
  rootDir: 'dist',
  testMatch: ['<rootDir>/**/tests/**/*.js'],
  preset: 'jest-puppeteer',
  bail: true,
  globals: {
    hello: 'asasdadadadadadadadasdasdadadadd',
    testGlobals: 'Hello World test globals from gennyteeer',
    dbURL: '',
    cacheURL: '',
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    client_secret: process.env.CLIENT_SECRET,
    token_url: process.env.TOKEN_URL,
    api_utils: process.env.API_UTILS,
    log: console.log
  }
};
