// Vercel Serverless Function for Backend API
const app = require('../backend/dist/app.js');

// Export the app (handle both default and named exports)
module.exports = app.default || app;
