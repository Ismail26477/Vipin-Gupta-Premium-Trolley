import { getDatabase } from '@/integrations/mongodb/client';
import { Review } from '@/integrations/mongodb/types';

const COLLECTION_NAME = 'reviews';

export async function getAllReviews(): Promise<Review[]> {
  const db = await getDatabase();
  const reviews = await db.collection<Review>(COLLECTION_NAME)
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  return reviews;
}

export async function getReviewById(id: string): Promise<Review | null> {
  const db = await getDatabase();
  const review = await db.collection<Review>(COLLECTION_NAME)
    .findOne({ id });
  return review || null;
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const db = await getDatabase();
  const reviews = await db.collection<Review>(COLLECTION_NAME)
    .find({ product_id: productId })
    .sort({ created_at: -1 })
    .toArray();
  return reviews;
}

export async function getReviewsByCustomer(customerId: string): Promise<Review[]> {
  const db = await getDatabase();
  const reviews = await db.collection<Review>(COLLECTION_NAME)
    .find({ customer_id: customerId })
    .sort({ created_at: -1 })
    .toArray();
  return reviews;
}

export async function createReview(review: Review): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection<Review>(COLLECTION_NAME)
    .insertOne(review);
  return result.insertedId.toString();
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Review>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { ...updates, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Review>(COLLECTION_NAME)
    .deleteOne({ id });
  return result.deletedCount > 0;
}
