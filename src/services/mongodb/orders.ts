import { getDatabase } from '@/integrations/mongodb/client';
import { Order } from '@/integrations/mongodb/types';

const COLLECTION_NAME = 'orders';

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDatabase();
  const orders = await db.collection<Order>(COLLECTION_NAME)
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDatabase();
  const order = await db.collection<Order>(COLLECTION_NAME)
    .findOne({ id });
  return order || null;
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  const db = await getDatabase();
  const orders = await db.collection<Order>(COLLECTION_NAME)
    .find({ customer_id: customerId })
    .sort({ created_at: -1 })
    .toArray();
  return orders;
}

export async function createOrder(order: Order): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection<Order>(COLLECTION_NAME)
    .insertOne(order);
  return result.insertedId.toString();
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Order>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { ...updates, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Order>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { status, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Order>(COLLECTION_NAME)
    .deleteOne({ id });
  return result.deletedCount > 0;
}
