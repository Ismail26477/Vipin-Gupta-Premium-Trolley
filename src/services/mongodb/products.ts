import { getDatabase } from '@/integrations/mongodb/client';
import { Product } from '@/integrations/mongodb/types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'products';

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({})
    .toArray();
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase();
  const product = await db.collection<Product>(COLLECTION_NAME)
    .findOne({ id });
  return product || null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({ category_id: categoryId })
    .toArray();
  return products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    })
    .toArray();
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({ featured: true })
    .toArray();
  return products;
}

export async function getTrendingProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({ trending: true })
    .toArray();
  return products;
}

export async function getNewArrivals(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>(COLLECTION_NAME)
    .find({ new_arrival: true })
    .sort({ created_at: -1 })
    .toArray();
  return products;
}

export async function createProduct(product: Product): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection<Product>(COLLECTION_NAME)
    .insertOne(product);
  return result.insertedId.toString();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Product>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { ...updates, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Product>(COLLECTION_NAME)
    .deleteOne({ id });
  return result.deletedCount > 0;
}
