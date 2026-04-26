# MongoDB Integration Guide

## Overview

This project has been migrated from Supabase PostgreSQL to MongoDB. All database operations now use the MongoDB Node.js driver with a service-based architecture for clean, maintainable code.

## Quick Start

### 1. Environment Configuration

Set your MongoDB URI in your environment variables:

```bash
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
```

### 2. Database Connection

The MongoDB client is automatically initialized through the connection manager:

```typescript
import { getDatabase } from '@/integrations/mongodb/client';

// Get the database instance
const db = await getDatabase();

// Perform operations
const products = await db.collection('products').find({}).toArray();
```

## Service Layer

All database operations are organized in `src/services/mongodb/`:

### Products Service
```typescript
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/services/mongodb/products';
```

### Categories Service
```typescript
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/services/mongodb/categories';
```

### Orders Service
```typescript
import {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} from '@/services/mongodb/orders';
```

### Reviews Service
```typescript
import {
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getReviewsByCustomer,
  createReview,
  updateReview,
  deleteReview
} from '@/services/mongodb/reviews';
```

### Customers Service
```typescript
import {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '@/services/mongodb/customers';
```

## Collection Structure

### products
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

### categories
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

### orders
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

### reviews
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

### customers
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

## Usage Examples

### Get All Products
```typescript
const products = await getAllProducts();
console.log(products);
```

### Search Products
```typescript
const results = await searchProducts('trolley');
console.log(results);
```

### Get Products by Category
```typescript
const categoryProducts = await getProductsByCategory('luggage');
console.log(categoryProducts);
```

### Create a New Order
```typescript
const newOrder = await createOrder({
  id: 'ORD-001',
  customer: 'John Doe',
  customer_id: 'cust_1',
  amount: 5000,
  status: 'Pending',
  items: ['prod_1', 'prod_2'],
  address: '123 Main St',
  payment: 'Credit Card'
});
console.log(newOrder);
```

### Get Customer Orders
```typescript
const orders = await getOrdersByCustomer('cust_1');
console.log(orders);
```

### Create a Review
```typescript
const review = await createReview({
  id: 'rev_1',
  product_id: 'prod_1',
  customer_id: 'cust_1',
  customer: 'John Doe',
  rating: 5,
  comment: 'Excellent product!',
  date: new Date()
});
console.log(review);
```

## Important Notes

1. **Connection Pooling**: The MongoDB client uses connection caching and pooling for efficient resource usage. The first connection initializes the client, and subsequent calls reuse the same connection.

2. **Error Handling**: All service functions include proper error handling. Make sure to wrap calls in try-catch blocks in your components.

3. **Data Types**: 
   - Use `ObjectId` from MongoDB for `_id` fields
   - Use strings for custom `id` fields (indexed as unique)
   - Use `Date` objects for timestamps
   - Use appropriate types for numbers (int, float as needed)

4. **Indexes**: MongoDB collections should have indexes created for:
   - All `id` fields (unique)
   - `category_id` for products
   - `customer_id` for orders and reviews
   - `product_id` for reviews
   - `status` fields for filtering

5. **Transactions**: For multi-document transactions, use MongoDB's session API (available in `src/integrations/mongodb/client.ts`).

## Migration from Supabase

### What Changed:
- ✅ Removed `@supabase/supabase-js` dependency
- ✅ Removed `/src/integrations/supabase/` directory
- ✅ Added MongoDB driver (`mongodb` package)
- ✅ Created `/src/integrations/mongodb/` with client connection
- ✅ Created `/src/services/mongodb/` with data access layer
- ✅ Updated `DATABASE_SCHEMA.md` to MongoDB schema
- ✅ Contexts (AuthContext, CartContext, WishlistContext) remain unchanged

### What Stayed the Same:
- Frontend components remain fully functional
- React Context API for state management
- Component structure and routing
- UI components and styling

## Best Practices

1. **Always use service functions** - Don't query the database directly from components
2. **Type your data** - Use TypeScript interfaces from `src/integrations/mongodb/types.ts`
3. **Handle errors gracefully** - Wrap service calls in try-catch or use error boundaries
4. **Cache when appropriate** - Consider using React Query for caching frequently accessed data
5. **Validate input** - Validate data before inserting/updating documents

## Troubleshooting

### Connection Issues
- Verify `VITE_MONGODB_URI` is correctly set
- Check MongoDB cluster is accessible from your network
- Ensure IP whitelist includes your current IP in MongoDB Atlas

### Query Not Returning Results
- Check collection name matches exactly (case-sensitive)
- Verify document structure matches expected schema
- Use MongoDB Compass to inspect collections

### Performance Issues
- Check indexes are created (see DATABASE_SCHEMA.md)
- Use `.limit()` and `.skip()` for pagination
- Monitor MongoDB Atlas metrics for slow queries

## Resources

- [MongoDB Node.js Driver](https://mongodb.com/docs/drivers/node/)
- [MongoDB Database Schema](./DATABASE_SCHEMA.md)
- [Service Layer](./src/services/mongodb/)
- [Types Definition](./src/integrations/mongodb/types.ts)
