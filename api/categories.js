import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0';
const dbName = process.env.DATABASE_NAME || 'trolley';

async function getDB() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return client.db(dbName);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getDB();
    const categories = await db.collection('categories').find({}).toArray();
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('[v0] Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
}
