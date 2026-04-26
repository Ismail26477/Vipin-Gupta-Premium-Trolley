// Export all MongoDB service functions for easy access

// Products
export {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products';

// Categories
export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories';

// Orders
export {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from './orders';

// Reviews
export {
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getReviewsByCustomer,
  createReview,
  updateReview,
  deleteReview,
} from './reviews';

// Customers
export {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customers';
