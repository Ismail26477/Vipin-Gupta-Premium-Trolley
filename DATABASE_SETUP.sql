-- ============================================================================
-- Global Imports Store - Database Setup SQL Scripts
-- Supabase PostgreSQL 14.4
-- ============================================================================

-- ============================================================================
-- 1. PRODUCTS TABLE
-- ============================================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock INT NOT NULL DEFAULT 0,
  brand VARCHAR(100),
  rating DECIMAL(2, 1),
  review_count INT DEFAULT 0,
  images TEXT[],
  specs JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_trending ON products(is_trending);
CREATE INDEX idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX idx_products_price ON products(price);

-- ============================================================================
-- 2. PRODUCT REVIEWS TABLE
-- ============================================================================

CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);

-- ============================================================================
-- 3. CATEGORIES TABLE
-- ============================================================================

CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert main category
INSERT INTO categories (id, name, slug, icon) 
VALUES ('luggage', 'Trolley Bags & Luggage', 'luggage', '🧳');

-- ============================================================================
-- 4. SUBCATEGORIES TABLE
-- ============================================================================

CREATE TABLE subcategories (
  id VARCHAR(50) PRIMARY KEY,
  parent_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert subcategories
INSERT INTO subcategories (id, parent_id, name, slug) VALUES
('cabin-size', 'luggage', 'Cabin Size', 'cabin-size'),
('medium-size', 'luggage', 'Medium Size', 'medium-size'),
('large-size', 'luggage', 'Large Size', 'large-size'),
('travel-sets', 'luggage', 'Travel Sets (3-in-1, 4-in-1)', 'travel-sets'),
('hard-shell', 'luggage', 'Hard Shell Luggage', 'hard-shell'),
('soft-luggage', 'luggage', 'Soft Luggage', 'soft-luggage');

-- ============================================================================
-- 5. USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash VARCHAR(255),
  profile_picture_url VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- 6. ADDRESSES TABLE
-- ============================================================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================================
-- 7. SHOPPING CARTS TABLE
-- ============================================================================

CREATE TABLE shopping_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_user_id ON shopping_carts(user_id);
CREATE INDEX idx_cart_product_id ON shopping_carts(product_id);

-- ============================================================================
-- 8. WISHLISTS TABLE
-- ============================================================================

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlists(product_id);

-- ============================================================================
-- 9. ORDERS TABLE
-- ============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  total_amount DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  billing_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- 10. ORDER ITEMS TABLE
-- ============================================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- 11. ROW LEVEL SECURITY POLICIES (Optional - for production)
-- ============================================================================

-- Products: Public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Reviews: Public read
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone"
  ON product_reviews FOR SELECT
  USING (true);

-- Users: Users can view and update their own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Addresses: Users can view and manage their addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Shopping Cart: Users can view and manage their cart
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart"
  ON shopping_carts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own cart"
  ON shopping_carts FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- Wishlist: Users can view and manage their wishlist
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR INSERT, UPDATE, DELETE
  USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Order Items: Users can view their own order items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 12. USEFUL VIEWS FOR DASHBOARD
-- ============================================================================

-- Revenue by Category
CREATE OR REPLACE VIEW revenue_by_category AS
SELECT 
  p.category,
  COUNT(DISTINCT oi.order_id) as order_count,
  COUNT(oi.id) as total_items_sold,
  SUM(oi.total_price) as total_revenue,
  AVG(p.price) as avg_product_price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.category;

-- Top Products
CREATE OR REPLACE VIEW top_products AS
SELECT 
  p.id,
  p.name,
  p.brand,
  p.price,
  COUNT(oi.id) as units_sold,
  SUM(oi.total_price) as revenue,
  AVG(pr.rating) as avg_rating,
  COUNT(pr.id) as review_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN product_reviews pr ON p.id = pr.product_id
GROUP BY p.id, p.name, p.brand, p.price
ORDER BY units_sold DESC;

-- Customer Metrics
CREATE OR REPLACE VIEW customer_metrics AS
SELECT 
  COUNT(DISTINCT u.id) as total_customers,
  COUNT(DISTINCT o.id) as total_orders,
  AVG(o.final_amount) as avg_order_value,
  MAX(o.created_at) as latest_order_date,
  MIN(u.created_at) as earliest_customer_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Monthly Revenue
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
  DATE_TRUNC('month', o.created_at)::DATE as month,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.final_amount) as total_revenue,
  AVG(o.final_amount) as avg_order_value
FROM orders o
WHERE o.status = 'delivered'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month DESC;

-- ============================================================================
-- 13. SAMPLE QUERIES FOR DASHBOARD
-- ============================================================================

-- Total Revenue (Last 30 Days)
-- SELECT SUM(final_amount) as total_revenue 
-- FROM orders 
-- WHERE status = 'delivered' 
-- AND created_at >= NOW() - INTERVAL '30 days';

-- Top 10 Products by Sales
-- SELECT * FROM top_products LIMIT 10;

-- Revenue by Category
-- SELECT * FROM revenue_by_category;

-- Customer Acquisition Trend
-- SELECT DATE(created_at) as date, COUNT(*) as new_customers 
-- FROM users 
-- GROUP BY DATE(created_at) 
-- ORDER BY date DESC;

-- Inventory Status
-- SELECT category, subcategory, SUM(stock) as total_stock, COUNT(*) as product_count
-- FROM products
-- GROUP BY category, subcategory;

-- Order Status Distribution
-- SELECT status, COUNT(*) as count, SUM(final_amount) as total_amount
-- FROM orders
-- GROUP BY status;

-- ============================================================================
-- End of Database Setup SQL
-- ============================================================================
