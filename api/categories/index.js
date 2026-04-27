const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'trolley';

// Default categories fallback
const defaultCategories = [
  { id: 'cabin', name: 'Cabin Trolleys', slug: 'cabin', description: 'Compact cabin-sized luggage' },
  { id: 'medium', name: 'Medium Trolleys', slug: 'medium', description: 'Perfect for weekend trips' },
  { id: 'large', name: 'Large Trolleys', slug: 'large', description: 'Ideal for extended travels' },
  { id: 'hardshell', name: 'Hard Shell', slug: 'hardshell', description: 'Durable hard shell luggage' },
  { id: 'softshell', name: 'Soft Shell', slug: 'softshell', description: 'Flexible soft luggage' },
  { id: 'sets', name: 'Luggage Sets', slug: 'sets', description: 'Complete luggage sets' },
];

async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check if MongoDB URI is configured
  if (!mongoUri) {
    console.warn('[v0] MongoDB URI not configured, using default categories');
    return res.status(200).json({
      success: true,
      data: defaultCategories,
      source: 'default'
    });
  }

  let client;
  try {
    console.log('[v0] Connecting to MongoDB for categories...');
    
    client = new MongoClient(mongoUri, { 
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      retryWrites: true,
    });
    
    await client.connect();
    console.log('[v0] Connected to MongoDB');
    
    const db = client.db(dbName);
    const categories = await db.collection('categories').find({}).toArray();
    
    console.log('[v0] Fetched', categories.length, 'categories');
    res.status(200).json({
      success: true,
      data: categories.length > 0 ? categories : defaultCategories,
      source: 'database'
    });
  } catch (error) {
    console.error('[v0] MongoDB error:', error.message);
    console.warn('[v0] Falling back to default categories');
    
    // Return default categories instead of error
    res.status(200).json({
      success: true,
      data: defaultCategories,
      source: 'fallback',
      warning: 'Using default data due to database error'
    });
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error('[v0] Error closing MongoDB client:', e.message);
      }
    }
  }
}

module.exports = handler;
