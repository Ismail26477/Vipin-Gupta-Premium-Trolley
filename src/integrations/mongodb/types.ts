import { ObjectId } from 'mongodb';

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  image_url: string;
  icon_url?: string | null;
  sort_order: number;
  is_deal: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubCategory {
  _id?: ObjectId;
  id: string;
  category_id: string;
  name: string;
  created_at?: Date;
}

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  category_id: string;
  price: number;
  discount_price: number;
  stock: number;
  brand: string;
  tags: string[];
  specifications: Record<string, string | number | boolean | string[]>;
  images: string[];
  featured: boolean;
  trending: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  status: 'Active' | 'Inactive';
  rating: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Customer {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined?: Date;
  recentOrders?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Order {
  _id?: ObjectId;
  id: string;
  customer: string;
  customer_id: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date?: Date;
  items?: string[];
  address: string;
  payment: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Review {
  _id?: ObjectId;
  id: string;
  product: string;
  product_id: string;
  customer: string;
  customer_id: string;
  rating: number;
  comment: string;
  date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Auth {
  id?: string;
  email: string;
  password?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}
