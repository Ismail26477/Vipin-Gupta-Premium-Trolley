const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0';
const dbName = process.env.DATABASE_NAME || 'trolley';

function normalizeProducts(products) {
  return products.map(p => ({
    ...p,
    id: p._id ? p._id.toString() : p.id || Math.random().toString(36)
  }));
}

async function getDB() {
  console.log('[v0] Connecting to MongoDB...');
  const client = new MongoClient(mongoUri, { 
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000,
  });
  await client.connect();
  console.log('[v0] Connected to MongoDB');
  return client.db(dbName);
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

  let client;
  try {
    console.log('[v0] Fetching products...');
    client = new MongoClient(mongoUri, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    await client.connect();
    const db = client.db(dbName);
    const products = await db.collection('products').find({}).limit(50).toArray();
    
    console.log('[v0] Fetched', products.length, 'products');
    res.status(200).json({
      success: true,
      data: normalizeProducts(products)
    });
  } catch (error) {
    console.error('[v0] Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

module.exports = handler;
