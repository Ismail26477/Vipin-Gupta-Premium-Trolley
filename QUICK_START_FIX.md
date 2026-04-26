# Quick Start - Run Your App Now

## Step 1: Set Environment Variables

Create `.env` file in your project root with:

```env
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
VITE_API_URL=http://localhost:5000/api
```

## Step 2: Start Your App

```bash
npm run dev
```

That's it! This command will:
- Start Express server on port 5000
- Start React app on port 5173
- Both automatically

## What You Should See

### Terminal Output
```
[v0] Server running on http://localhost:5000
[v0] API available at http://localhost:5000/api/*
[v0] Products loaded: 8
[v0] Categories loaded: 5
```

### Browser (http://localhost:5173)
- Homepage loads without errors
- Products display from MongoDB
- All pages working properly

### Browser Console (DevTools)
- NO red errors
- Messages starting with `[v0]`

## If Something Goes Wrong

### Error: "Cannot GET /api/products"
Server didn't start. Try:
```bash
npm run server
# In another terminal:
npm run dev
```

### Error: "Failed to fetch"
Check:
1. Is server running on port 5000?
2. Is `.env` file created?
3. Is MongoDB URI correct?

### Empty product list
1. Check MongoDB has "trolley" database
2. Check collections have data
3. Verify MongoDB credentials

## File You Need to Know About

- `.env` - Your MongoDB connection string
- `server/index.js` - Express API server
- `src/data/products.ts` - Product data layer
- `src/data/categories.ts` - Category data layer

## Test the API Directly

Open in browser:
```
http://localhost:5000/api/health
```

Should show:
```json
{"status":"ok","dbConnected":true}
```

## All Set!

Your app is now:
- Fetching real data from MongoDB
- Using a proper API backend
- No hardcoded data
- Production-ready architecture

Happy coding!
