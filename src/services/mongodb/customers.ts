import { getDatabase } from '@/integrations/mongodb/client';
import { Customer } from '@/integrations/mongodb/types';

const COLLECTION_NAME = 'customers';

export async function getAllCustomers(): Promise<Customer[]> {
  const db = await getDatabase();
  const customers = await db.collection<Customer>(COLLECTION_NAME)
    .find({})
    .toArray();
  return customers;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const db = await getDatabase();
  const customer = await db.collection<Customer>(COLLECTION_NAME)
    .findOne({ id });
  return customer || null;
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const db = await getDatabase();
  const customer = await db.collection<Customer>(COLLECTION_NAME)
    .findOne({ email });
  return customer || null;
}

export async function createCustomer(customer: Customer): Promise<string> {
  const db = await getDatabase();
  const result = await db.collection<Customer>(COLLECTION_NAME)
    .insertOne(customer);
  return result.insertedId.toString();
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Customer>(COLLECTION_NAME)
    .updateOne({ id }, { $set: { ...updates, updated_at: new Date() } });
  return result.modifiedCount > 0;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Customer>(COLLECTION_NAME)
    .deleteOne({ id });
  return result.deletedCount > 0;
}
