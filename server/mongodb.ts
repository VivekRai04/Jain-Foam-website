import { MongoClient, Db, Collection, ObjectId, Document, GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import { Readable } from 'stream';

// Types
export interface GalleryItem {
  _id?: ObjectId;
  id: string;
  title: string;
  category: string;
  image_filename: string;
  image_path: string;
  image_gridfs_id?: string; // GridFS file ID for persistent storage
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
  image_gridfs_id?: string; // GridFS file ID for persistent storage
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
let gridfsBucket: GridFSBucket | null = null;

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
    
    // Create GridFS bucket for image storage
    await createGridFSBucket(db);
    
    // Create indexes
    await createIndexes(db);
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function createGridFSBucket(database: Db): Promise<void> {
  try {
    gridfsBucket = new GridFSBucket(database, {
      bucketName: 'images',
      chunkSizeBytes: 261120, // 255KB chunks for better performance
    });
    console.log('GridFS bucket "images" initialized');
  } catch (error) {
    console.error('Error creating GridFS bucket:', error);
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
  // GridFSBucket doesn't have a close method, it will be closed when client closes
  gridfsBucket = null;
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

// GridFS helper functions
export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (!gridfsBucket) {
    await connectToDatabase();
  }
  return gridfsBucket!;
}

export async function uploadFileToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata?: Record<string, unknown>
): Promise<ObjectId> {
  const bucket = await getGridFSBucket();
  
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // The file ID is available on the stream immediately
    uploadStream.on('finish', () => {
      resolve(uploadStream.id as ObjectId);
    });
    
    uploadStream.on('error', (error) => {
      reject(error);
    });
    
    readable.pipe(uploadStream);
  });
}

export async function getFileFromGridFS(fileId: string): Promise<{ stream: GridFSBucketReadStream; info: { filename: string; contentType: string; length: number; _id: ObjectId } } | null> {
  try {
    const bucket = await getGridFSBucket();
    const objectId = new ObjectId(fileId);
    
    const stream = bucket.openDownloadStream(objectId);
    
    return new Promise((resolve, reject) => {
      let fileInfo: { filename: string; contentType: string; length: number; _id: ObjectId } | null = null;
      
      stream.on('file', (file) => {
        fileInfo = {
          filename: file.filename,
          contentType: file.contentType || 'application/octet-stream',
          length: file.length,
          _id: file._id,
        };
      });
      
      stream.on('error', (error) => {
        if (error.message.includes('FileNotFound')) {
          resolve(null);
        } else {
          reject(error);
        }
      });
      
      stream.on('end', () => {
        if (fileInfo) {
          resolve({ stream, info: fileInfo });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting file from GridFS:', error);
    return null;
  }
}

export async function deleteFileFromGridFS(fileId: string): Promise<boolean> {
  try {
    const bucket = await getGridFSBucket();
    const objectId = new ObjectId(fileId);
    await bucket.delete(objectId);
    return true;
  } catch (error) {
    console.error('Error deleting file from GridFS:', error);
    return false;
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
