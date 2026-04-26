import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db = null;

// Helper function to normalize MongoDB products to have 'id' field
function normalizeProducts(products) {
  return products.map(p => ({
    ...p,
    id: p._id ? p._id.toString() : p.id || Math.random().toString(36)
  }));
}

async function initDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || 'mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0';
    const dbName = process.env.DATABASE_NAME || 'trolley';
    
    console.log('[v0] Connecting to MongoDB...');
    console.log('[v0] Database name:', dbName);
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    console.log('[v0] Database connected successfully');
  } catch (error) {
    console.error('[v0] Database connection error:', error.message);
    process.exit(1);
  }
}

initDB();

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const products = await db.collection('products').find({}).toArray();
    res.json({ success: true, data: normalizeProducts(products) });
  } catch (error) {
    console.error('[v0] Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const featured = await db.collection('products').find({ featured: true }).toArray();
    res.json({ success: true, data: normalizeProducts(featured) });
  } catch (error) {
    console.error('[v0] Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products', details: error.message });
  }
});

// Get trending products
app.get('/api/products/trending', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const trending = await db.collection('products').find({ trending: true }).toArray();
    res.json({ success: true, data: normalizeProducts(trending) });
  } catch (error) {
    console.error('[v0] Error fetching trending products:', error);
    res.status(500).json({ error: 'Failed to fetch trending products', details: error.message });
  }
});

// Get discounted products
app.get('/api/products/discounted', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const discounted = await db.collection('products').find({
      $expr: { $gt: ['$price', '$discount_price'] }
    }).toArray();
    res.json({ success: true, data: normalizeProducts(discounted) });
  } catch (error) {
    console.error('[v0] Error fetching discounted products:', error);
    res.status(500).json({ error: 'Failed to fetch discounted products', details: error.message });
  }
});

// Get best sellers
app.get('/api/products/best-sellers', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const bestSellers = await db.collection('products').find({ best_seller: true }).toArray();
    res.json({ success: true, data: normalizeProducts(bestSellers) });
  } catch (error) {
    console.error('[v0] Error fetching best sellers:', error);
    res.status(500).json({ error: 'Failed to fetch best sellers', details: error.message });
  }
});

// Get new arrivals
app.get('/api/products/new-arrivals', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const newArrivals = await db.collection('products').find({ new_arrival: true }).toArray();
    res.json({ success: true, data: normalizeProducts(newArrivals) });
  } catch (error) {
    console.error('[v0] Error fetching new arrivals:', error);
    res.status(500).json({ error: 'Failed to fetch new arrivals', details: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    let product;
    const id = req.params.id;
    
    // Try to find by MongoDB _id first
    try {
      if (ObjectId.isValid(id)) {
        product = await db.collection('products').findOne({ _id: new ObjectId(id) });
      }
    } catch (e) {
      // Not a valid ObjectId, continue to try other fields
    }
    
    // If not found by _id, try by custom id field
    if (!product) {
      product = await db.collection('products').findOne({ id: id });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, data: normalizeProducts([product])[0] });
  } catch (error) {
    console.error('[v0] Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

// Get products by category
app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const products = await db.collection('products').find({ category_id: req.params.categoryId }).toArray();
    res.json({ success: true, data: normalizeProducts(products) });
  } catch (error) {
    console.error('[v0] Error fetching category products:', error);
    res.status(500).json({ error: 'Failed to fetch category products', details: error.message });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const query = req.params.query.toLowerCase();
    const results = await db.collection('products').find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json({ success: true, data: normalizeProducts(results) });
  } catch (error) {
    console.error('[v0] Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products', details: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const categories = await db.collection('categories').find({}).toArray();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('[v0] Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Get category by ID
app.get('/api/categories/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const category = await db.collection('categories').findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('[v0] Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: db !== null });
});

app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`);
  console.log('[v0] API available at http://localhost:${PORT}/api/*');
});
