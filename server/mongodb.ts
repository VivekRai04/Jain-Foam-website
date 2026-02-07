
import mongoose from 'mongoose';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jain-foam';

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image_filename: { type: String, required: true },
  image_path: { type: String, required: true },
  order_index: { type: Number, default: 0 },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
});

// Gallery Item Schema
const galleryItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  image_filename: { type: String, required: true },
  image_path: { type: String, required: true },
  order_index: { type: Number, default: 0 },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
});

// Contact Inquiry Schema
const contactInquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }
});

// Models
export const Product = mongoose.model('Product', productSchema);
export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
export const Category = mongoose.model('Category', categorySchema);

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Seed initial data if database is empty
    await seedInitialData();
    
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
}

async function seedInitialData() {
  // Check if there are any existing products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log('Seeding initial products...');
    // Seed data will come from your existing SQLite database
  }
  
  // Check if there are any existing gallery items
  const galleryCount = await GalleryItem.countDocuments();
  if (galleryCount === 0) {
    console.log('Seeding initial gallery items...');
    // Seed data will come from your existing SQLite database
  }
  
  // Check if there are any existing categories
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    console.log('Seeding initial categories...');
    // Seed data will come from your existing storage.ts
  }
}

// Disconnect from MongoDB
export async function disconnectFromMongoDB() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    return true;
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    return false;
  }
}
