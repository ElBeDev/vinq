// Vercel Serverless Function for Backend API
const path = require('path');

module.exports = async (req, res) => {
  try {
    // Import the Express app
    const appPath = path.join(__dirname, '../backend/dist/app.js');
    const app = require(appPath);
    
    // Get the actual app (handle default export)
    const expressApp = app.default || app;
    
    // Handle the request with Express
    return expressApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize API',
      error: error.message,
      stack: error.stack
    });
  }
};
