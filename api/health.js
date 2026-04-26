module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    console.log('[v0] Health check - MongoDB URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('[v0] Health check - Database name:', process.env.DATABASE_NAME || 'trolley');
    
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      environment: {
        mongodb_configured: !!process.env.MONGODB_URI,
        database_name: process.env.DATABASE_NAME || 'trolley',
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('[v0] Health check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
