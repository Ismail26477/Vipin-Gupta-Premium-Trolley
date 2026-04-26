import { getDatabase } from '@/integrations/mongodb/client';
import { Category } from '@/integrations/mongodb/types';

const COLLECTION_NAME = 'categories';

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDatabase();
  const categories = await db.collection<Category>(COLLECTION_NAME)
    .find({})
    .sort({ sort_order: 1 })
    .toArray();
  return categories;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase();
  const category = await db.collection<Category>(COLLECTION_NAME)
    .findOne({ id });
  return category || null;
}

export async function createCategory(category: Category): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection<Category>(COLLECTION_NAME)
    .insertOne(category);
  return result.insertedId.toString();
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Category>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { ...updates, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Category>(COLLECTION_NAME)
    .deleteOne({ id });
  return result.deletedCount > 0;
}
