import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';

// Types
export interface GalleryItem {
  _id?: ObjectId;
  id: string;
  title: string;
  category: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  description: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'jain_foam';

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    
    // Create indexes
    await createIndexes(db);
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function createIndexes(database: Db): Promise<void> {
  // Gallery indexes
  await database.collection<GalleryItem>('gallery_items').createIndex({ id: 1 }, { unique: true });
  await database.collection<GalleryItem>('gallery_items').createIndex({ category: 1 });
  await database.collection<GalleryItem>('gallery_items').createIndex({ order_index: 1 });

  // Product indexes
  await database.collection<Product>('products').createIndex({ id: 1 }, { unique: true });
  await database.collection<Product>('products').createIndex({ category: 1 });

  // Contact inquiry indexes
  await database.collection<ContactInquiry>('contact_inquiries').createIndex({ id: 1 }, { unique: true });
  await database.collection<ContactInquiry>('contact_inquiries').createIndex({ status: 1 });
  await database.collection<ContactInquiry>('contact_inquiries').createIndex({ created_at: -1 });

  // Category indexes
  await database.collection<Category>('categories').createIndex({ id: 1 }, { unique: true });
  await database.collection<Category>('categories').createIndex({ slug: 1 }, { unique: true });

  console.log('MongoDB indexes created');
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(name);
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

// Export collections getter
export async function getGalleryCollection(): Promise<Collection<GalleryItem>> {
  return getCollection<GalleryItem>('gallery_items');
}

export async function getProductsCollection(): Promise<Collection<Product>> {
  return getCollection<Product>('products');
}

export async function getContactInquiriesCollection(): Promise<Collection<ContactInquiry>> {
  return getCollection<ContactInquiry>('contact_inquiries');
}

export async function getCategoriesCollection(): Promise<Collection<Category>> {
  return getCollection<Category>('categories');
}
