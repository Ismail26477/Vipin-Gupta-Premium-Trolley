# MongoDB Quick Start Guide

## Setup (5 minutes)

### 1. Environment Variable
Create a `.env.local` file in the project root:
```bash
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Using MongoDB Services

### Import Services
```typescript
// Option 1: Import all from barrel export
import { getAllProducts, getProductsByCategory, createOrder } from '@/services/mongodb';

// Option 2: Import from specific module
import { getAllProducts } from '@/services/mongodb/products';
import { getOrdersByCustomer } from '@/services/mongodb/orders';
```

## Common Patterns

### Fetch Products
```typescript
import { getAllProducts, getFeaturedProducts } from '@/services/mongodb';

// Get all products
const products = await getAllProducts();

// Get featured products
const featured = await getFeaturedProducts();

// Search products
const search = await searchProducts('trolley');
```

### Work with Orders
```typescript
import { 
  createOrder, 
  getOrdersByCustomer, 
  updateOrderStatus 
} from '@/services/mongodb';

// Create order
const orderId = await createOrder({
  id: 'ORD-001',
  customer: 'John Doe',
  customer_id: 'cust_1',
  amount: 5000,
  status: 'Pending',
  items: ['prod_1'],
  address: '123 Main St',
  payment: 'Credit Card'
});

// Get customer orders
const orders = await getOrdersByCustomer('cust_1');

// Update order status
await updateOrderStatus('ORD-001', 'Shipped');
```

### Handle Reviews
```typescript
import { 
  getReviewsByProduct, 
  createReview 
} from '@/services/mongodb';

// Get product reviews
const reviews = await getReviewsByProduct('prod_1');

// Create a review
await createReview({
  id: 'rev_1',
  product_id: 'prod_1',
  customer_id: 'cust_1',
  customer: 'John Doe',
  rating: 5,
  comment: 'Great product!'
});
```

## Error Handling

Always wrap service calls in try-catch:

```typescript
try {
  const products = await getAllProducts();
  console.log('Products:', products);
} catch (error) {
  console.error('Failed to fetch products:', error);
  // Handle error appropriately
}
```

## In React Components

```typescript
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/services/mongodb';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## Collections Reference

### Products Collection
```javascript
{
  id: "prod_1",
  name: "Wave Luxe Set",
  category_id: "cat_1",
  price: 8999,
  discount_price: 7889,
  featured: true,
  rating: 4.5,
  ...
}
```

### Categories Collection
```javascript
{
  id: "cat_1",
  name: "Trolley Bags",
  sort_order: 1,
  is_deal: false,
  ...
}
```

### Orders Collection
```javascript
{
  id: "ORD-001",
  customer_id: "cust_1",
  amount: 5000,
  status: "Pending",
  ...
}
```

### Reviews Collection
```javascript
{
  id: "rev_1",
  product_id: "prod_1",
  customer_id: "cust_1",
  rating: 5,
  comment: "Great!",
  ...
}
```

### Customers Collection
```javascript
{
  id: "cust_1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  orders: 5,
  spent: 25000,
  ...
}
```

## Database Operations by Collection

### Products
```typescript
import {
  getAllProducts,           // Get all products
  getProductById,           // Get one product
  getProductsByCategory,    // Filter by category
  searchProducts,           // Search by name/description
  getFeaturedProducts,      // Get featured items
  getTrendingProducts,      // Get trending items
  getNewArrivals,          // Get new products
  createProduct,           // Create new product
  updateProduct,           // Update product
  deleteProduct            // Delete product
} from '@/services/mongodb/products';
```

### Categories
```typescript
import {
  getAllCategories,        // Get all categories
  getCategoryById,         // Get one category
  createCategory,          // Create category
  updateCategory,          // Update category
  deleteCategory           // Delete category
} from '@/services/mongodb/categories';
```

### Orders
```typescript
import {
  getAllOrders,           // Get all orders
  getOrderById,           // Get one order
  getOrdersByCustomer,    // Get customer's orders
  createOrder,            // Create order
  updateOrder,            // Update order
  updateOrderStatus,      // Change order status
  deleteOrder             // Delete order
} from '@/services/mongodb/orders';
```

### Reviews
```typescript
import {
  getAllReviews,          // Get all reviews
  getReviewById,          // Get one review
  getReviewsByProduct,    // Get product reviews
  getReviewsByCustomer,   // Get customer reviews
  createReview,           // Create review
  updateReview,           // Update review
  deleteReview            // Delete review
} from '@/services/mongodb/reviews';
```

### Customers
```typescript
import {
  getAllCustomers,        // Get all customers
  getCustomerById,        // Get one customer
  getCustomerByEmail,     // Find by email
  createCustomer,         // Create customer
  updateCustomer,         // Update customer
  deleteCustomer          // Delete customer
} from '@/services/mongodb/customers';
```

## Troubleshooting

### Connection Error
If you get a connection error:
1. Check `VITE_MONGODB_URI` is set correctly
2. Verify MongoDB cluster is running
3. Ensure your IP is whitelisted in MongoDB Atlas

### No Results
1. Verify collection names (case-sensitive)
2. Check document structure matches expected schema
3. Use MongoDB Compass to inspect data

### Performance Issues
1. Check indexes are created (see DATABASE_SCHEMA.md)
2. Add `.limit()` for pagination
3. Monitor MongoDB Atlas metrics

## Resources

- [Full Documentation](./MONGODB_INTEGRATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Migration Summary](./MIGRATION_SUMMARY.md)
- [MongoDB Docs](https://mongodb.com/docs/drivers/node/)

## Next Steps

1. ✅ Setup complete
2. ⬜ Connect to real MongoDB (set VITE_MONGODB_URI)
3. ⬜ Test services in your components
4. ⬜ Create indexes for better performance
5. ⬜ Deploy to production

Happy coding! 🚀
