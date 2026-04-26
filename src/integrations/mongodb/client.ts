import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0';
const DATABASE_NAME = 'trolley';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(DATABASE_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

export default {
  connectToDatabase,
  getDatabase,
  closeDatabase,
};
