const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'trolley';

// Default products fallback
const defaultProducts = [
  { id: '1', name: 'Premium Trolley - Black', price: 4999, category_id: 'cabin', image: '/images/prod-urban-gray-1.jpg' },
  { id: '2', name: 'Elite Trolley - Burgundy', price: 5999, category_id: 'medium', image: '/images/prod-elite-burgundy-1.jpg' },
  { id: '3', name: 'Royal Trolley - Gold', price: 6999, category_id: 'large', image: '/images/prod-royal-4in1-1.jpg' },
  { id: '4', name: 'Wave Trolley - Fuchsia', price: 4499, category_id: 'hardshell', image: '/images/prod-wave-3in1-1.jpg' },
  { id: '5', name: 'Zenith Trolley - Navy', price: 5499, category_id: 'softshell', image: '/images/prod-zenith-navy-1.jpg' },
  { id: '6', name: 'Apex Trolley - Titanium', price: 7499, category_id: 'sets', image: '/images/prod-apex-titanium-1.jpg' },
];

function normalizeProducts(products) {
  return products.map(p => ({
    ...p,
    id: p._id ? p._id.toString() : p.id || Math.random().toString(36)
  }));
}

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
    console.warn('[v0] MongoDB URI not configured, using default products');
    return res.status(200).json({
      success: true,
      data: defaultProducts,
      source: 'default'
    });
  }

  let client;
  try {
    console.log('[v0] Connecting to MongoDB for products...');
    
    client = new MongoClient(mongoUri, { 
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      retryWrites: true,
    });
    
    await client.connect();
    console.log('[v0] Connected to MongoDB');
    
    const db = client.db(dbName);
    console.log('[v0] Fetching from products collection...');
    const products = await db.collection('products').find({}).limit(50).toArray();
    
    console.log('[v0] Fetched', products.length, 'products');
    res.status(200).json({
      success: true,
      data: products.length > 0 ? normalizeProducts(products) : defaultProducts,
      source: 'database'
    });
  } catch (error) {
    console.error('[v0] MongoDB error:', error.message);
    console.warn('[v0] Falling back to default products');
    
    // Return default products instead of error
    res.status(200).json({
      success: true,
      data: defaultProducts,
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
