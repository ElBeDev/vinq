// Vercel Serverless Function for Backend API
// This file acts as the entry point for all API routes in Vercel
// Environment variables are automatically available from Vercel

module.exports = async (req, res) => {
  try {
    // Set CORS headers
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://vinq.vercel.app',
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Import the Express app
    const path = require('path');
    const appPath = path.join(__dirname, '../backend/dist/app.js');
    
    // Dynamic import to handle both CommonJS and ES modules
    let expressApp;
    try {
      const app = require(appPath);
      expressApp = app.default || app;
    } catch (error) {
      console.error('Error loading app:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to load API',
        error: error.message,
        hint: 'Make sure backend is built. Run: cd backend && npm run build'
      });
    }

    // Check if it's a function (Express app)
    if (typeof expressApp === 'function') {
      return expressApp(req, res);
    } else {
      console.error('expressApp is not a function:', typeof expressApp);
      return res.status(500).json({
        success: false,
        message: 'API handler is not properly exported',
        type: typeof expressApp
      });
    }
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
