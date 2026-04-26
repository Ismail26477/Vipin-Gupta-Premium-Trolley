# MongoDB API Backend Setup

## Architecture Overview

Your application now uses a **three-layer architecture**:

```
Browser (React Frontend)
    ↓ (HTTP Fetch)
Express API Server (Node.js)
    ↓ (Direct Connection)
MongoDB Database
```

## Installation

All dependencies have been installed:
```bash
npm install
```

This installs:
- `express` - REST API server framework
- `cors` - Cross-origin request handling  
- `concurrently` - Run server + frontend together
- `mongodb` - MongoDB Node.js driver

## Running the Application

### Development Mode (Both Server + Frontend)

```bash
npm run dev
```

This command:
1. Starts the Express server on `http://localhost:5000`
2. Starts the Vite dev server on `http://localhost:5173`
3. Frontend automatically fetches from `http://localhost:5000/api`

### Server Only

```bash
npm run server
```

Server runs on `http://localhost:5000`

### Frontend Only

```bash
npm run dev
```

(But you need the server running separately)

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
VITE_API_URL=http://localhost:5000/api
```

Or set them in your terminal:
```bash
export VITE_MONGODB_URI="mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0"
export VITE_API_URL="http://localhost:5000/api"
```

## API Endpoints

The Express server provides the following endpoints:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/discounted` - Get discounted products
- `GET /api/products/best-sellers` - Get best sellers
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/search/:query` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Health Check
- `GET /api/health` - Check API status

## How Data Flows

1. **Page Load**: Browser makes HTTP request to API
2. **API Server**: Node.js Express server receives request
3. **MongoDB Connection**: Server connects to MongoDB cluster
4. **Query Execution**: MongoDB returns data matching query
5. **API Response**: Server returns JSON to browser
6. **Frontend Caching**: React caches data globally for instant access

## Error Handling

All API calls include error handling. If the server is not running:

```
[v0] API fetch failed: Failed to fetch
```

Check:
1. Is the server running? (`npm run server`)
2. Is `VITE_API_URL` correct?
3. Is MongoDB URI in `.env` file?
4. Can you access `http://localhost:5000/api/health`?

## Data Initialization Flow

```
App.tsx loads
  ↓
useEffect runs
  ↓
initializeProducts() called
  ↓
Fetch /api/products
  ↓
Data cached globally
  ↓
Components use cached data
  ↓
No additional API calls needed
```

## Frontend Components

The data fetching is abstracted in `src/data/`:

- `src/data/products.ts` - Product functions (using cached data)
- `src/data/categories.ts` - Category functions (using cached data)

All components import from these files, not directly from the API.

## Troubleshooting

### "Cannot GET /api/products"
- Server is not running. Run `npm run server`

### "Uncaught TypeError: Class extends value undefined"
- MongoDB driver issue in browser. Should be fixed now with API approach.

### "Cannot POST to API"
- Check CORS headers in `server/index.js`
- Ensure `cors()` middleware is enabled

### Empty product list
- MongoDB collection is empty
- Check MongoDB connection URI
- Verify database name is "trolley"

## Production Deployment

For production on Vercel:

1. Deploy frontend to Vercel (automatically detects `build` command)
2. Deploy backend as separate serverless function or containerized service
3. Update `VITE_API_URL` to production API endpoint

```env
VITE_API_URL=https://your-api-domain.com/api
```

## File Structure

```
project/
├── src/
│   ├── data/
│   │   ├── products.ts (API wrapper)
│   │   ├── categories.ts (API wrapper)
│   ├── lib/
│   │   └── api.ts (API utility functions)
│   ├── pages/
│   │   └── ...
│   └── components/
│       └── ...
├── server/
│   └── index.js (Express API server)
├── .env (environment variables)
└── package.json (scripts & dependencies)
```

