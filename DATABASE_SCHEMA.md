# MongoDB Database Schema - Trolley E-Commerce

## Overview
This document provides complete database structure information for the Trolley E-Commerce Platform. The system is built with **MongoDB** as the backend database.

---

## Database Configuration

### Provider: MongoDB
- **Database Type**: MongoDB NoSQL
- **Cluster**: Cluster0
- **Database Name**: `trolley`
- **Connection URI**: Environment Variable `VITE_MONGODB_URI`
- **Credentials**: mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net

### Connection Details
```typescript
// Client Configuration (src/integrations/mongodb/client.ts)
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_URI;
const DATABASE_NAME = 'trolley';

export async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);
  return { client, db };
}
```

---

## Collections

### 1. products

**Collection Name**: `products`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  name: string,
  description: string,
  category_id: string,
  price: number,
  discount_price: number,
  stock: number,
  brand: string,
  rating: number,
  tags: string[],
  specifications: object,
  images: string[],
  featured: boolean,
  trending: boolean,
  best_seller: boolean,
  new_arrival: boolean,
  status: 'Active' | 'Inactive',
  created_at: Date,
  updated_at: Date
}
```

**Document Example**:

```javascript
{
  _id: ObjectId("..."),
  id: "prod_1",
  name: "Wave Luxe Set – Fuchsia",
  description: "Premium cabin-size trolley...",
  category_id: "cat_1",
  price: 8999,
  discount_price: 7889.12,
  stock: 45,
  brand: "Wave",
  rating: 4.5,
  tags: ["cabin", "fuchsia", "lightweight"],
  specifications: {
    "Capacity": "22L",
    "Material": "Polycarbonate"
  },
  images: ["/images/wave-luxe-fuchsia-1.jpg"],
  featured: true,
  trending: true,
  best_seller: false,
  new_arrival: false,
  status: "Active",
  created_at: ISODate("2024-01-15T10:30:00Z"),
  updated_at: ISODate("2024-01-20T15:45:00Z")
}
```

### 2. reviews

**Collection Name**: `reviews`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  product_id: string,
  customer_id: string,
  customer: string,
  rating: number (1-5),
  comment: string,
  date: Date,
  created_at: Date,
  updated_at: Date
}
```

**Document Example**:

```javascript
{
  _id: ObjectId("..."),
  id: "rev_1",
  product_id: "prod_1",
  customer_id: "cust_1",
  customer: "Rahul S.",
  rating: 5,
  comment: "Perfect for my travels! Excellent quality.",
  date: ISODate("2024-01-10T14:20:00Z"),
  created_at: ISODate("2024-01-10T14:20:00Z"),
  updated_at: ISODate("2024-01-10T14:20:00Z")
}
```

### 3. categories

**Collection Name**: `categories`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  name: string,
  image_url: string,
  icon_url: string | null,
  sort_order: number,
  is_deal: boolean,
  created_at: Date,
  updated_at: Date
}
```

**Document Example**:

```javascript
{
  _id: ObjectId("..."),
  id: "cat_1",
  name: "Trolley Bags & Luggage",
  image_url: "/images/luggage.jpg",
  icon_url: null,
  sort_order: 1,
  is_deal: false,
  created_at: ISODate("2024-01-01T00:00:00Z"),
  updated_at: ISODate("2024-01-01T00:00:00Z")
}
```

### 4. subcategories

**Collection Name**: `subcategories`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  category_id: string,
  name: string,
  created_at: Date
}
```

### 5. customers

**Collection Name**: `customers`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  name: string,
  email: string,
  phone: string,
  orders: number,
  spent: number,
  joined: Date,
  recentOrders: string[],
  created_at: Date,
  updated_at: Date
}
```

### 6. orders

**Collection Name**: `orders`

```javascript
{
  _id: ObjectId,
  id: string (unique),
  customer: string,
  customer_id: string,
  amount: number,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  date: Date,
  items: string[],
  address: string,
  payment: string,
  created_at: Date,
  updated_at: Date
}
```

**Order Status Values**:
- `Pending` - Order placed, awaiting confirmation
- `Processing` - Preparing for shipment
- `Shipped` - In transit
- `Delivered` - Successfully delivered
- `Cancelled` - Order cancelled



## Indexes (Recommended)

Create these indexes for optimal query performance:

```javascript
// Products indexes
db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category_id: 1 });
db.products.createIndex({ featured: 1 });
db.products.createIndex({ trending: 1 });
db.products.createIndex({ new_arrival: 1 });
db.products.createIndex({ brand: 1 });

// Categories indexes
db.categories.createIndex({ id: 1 }, { unique: true });

// Reviews indexes
db.reviews.createIndex({ id: 1 }, { unique: true });
db.reviews.createIndex({ product_id: 1 });
db.reviews.createIndex({ customer_id: 1 });

// Orders indexes
db.orders.createIndex({ id: 1 }, { unique: true });
db.orders.createIndex({ customer_id: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ created_at: -1 });

// Customers indexes
db.customers.createIndex({ id: 1 }, { unique: true });
db.customers.createIndex({ email: 1 }, { unique: true });
```

## Service Layer

Database operations are abstracted through service modules in `src/services/mongodb/`:

- **products.ts** - Product queries and mutations
- **categories.ts** - Category management
- **customers.ts** - Customer data operations
- **orders.ts** - Order management
- **reviews.ts** - Review management

### Example Usage

```typescript
import { getAllProducts, getProductsByCategory } from '@/services/mongodb/products';
import { getReviewsByProduct } from '@/services/mongodb/reviews';
import { getOrdersByCustomer } from '@/services/mongodb/orders';

// Get all products
const products = await getAllProducts();

// Get products by category
const trolleys = await getProductsByCategory('cat_1');

// Get product reviews
const reviews = await getReviewsByProduct('prod_1');

// Get customer orders
const orders = await getOrdersByCustomer('cust_1');
```

## Connection Management

The MongoDB client is managed through `src/integrations/mongodb/client.ts` with:
- Connection pooling for efficient resource usage
- Automatic reconnection on failure
- Cached database instances

```typescript
// Connection flow
connectToDatabase() -> MongoClient connect -> select database -> return instances
```

## Environment Variables Required

```env
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
```

## Notes for Development

1. **Data Migration**: Use MongoDB Compass to manage data in the trolley database
2. **Collections**: Ensure all collections exist in MongoDB before running queries
3. **Performance**: Implement proper indexes as listed above for optimal performance
4. **Caching**: Consider caching frequently accessed data (categories, featured products)
5. **Error Handling**: All service functions include error handling for database operations
6. **Backup**: Regular backups of MongoDB database recommended

---

**Last Updated**: April 2026
**Version**: 2.0 (Migrated from Supabase PostgreSQL to MongoDB)
