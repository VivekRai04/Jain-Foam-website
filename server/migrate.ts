
import sqlite3 from 'sqlite3';
import { join } from 'path';
import { connectToMongoDB, Product, GalleryItem, ContactInquiry, Category } from './mongodb';
import { randomUUID } from 'crypto';

// SQLite database path
const sqlitePath = join(process.cwd(), 'data', 'app.db');

async function migrateSQLiteToMongoDB() {
  console.log('=== Starting SQLite to MongoDB Migration ===');
  
  try {
    // Connect to MongoDB
    const mongoConnected = await connectToMongoDB();
    if (!mongoConnected) {
      console.error('Failed to connect to MongoDB');
      return;
    }
    
    console.log('✅ MongoDB connection established');
    
    // Connect to SQLite
    const sqliteDB = new sqlite3.Database(sqlitePath);
    
    // Migration functions
    await migrateProducts(sqliteDB);
    await migrateGalleryItems(sqliteDB);
    await migrateContactInquiries(sqliteDB);
    await migrateCategories();
    
    // Close SQLite connection
    sqliteDB.close();
    
    console.log('=== Migration Complete ===');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

async function migrateProducts(sqliteDB: sqlite3.Database) {
  console.log('Migrating products...');
  
  return new Promise<void>((resolve, reject) => {
    sqliteDB.all('SELECT * FROM products', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Found ${rows.length} products to migrate`);
      
      for (const product of rows as any[]) {
        const existing = await Product.findOne({ id: product.id });
        if (!existing) {
          const newProduct = new Product({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            image_filename: product.image_filename,
            image_path: product.image_path,
            order_index: product.order_index,
            created_at: product.created_at,
            updated_at: product.updated_at
          });
          
          await newProduct.save();
        }
      }
      
      console.log('✅ Products migrated');
      resolve();
    });
  });
}

async function migrateGalleryItems(sqliteDB: sqlite3.Database) {
  console.log('Migrating gallery items...');
  
  return new Promise<void>((resolve, reject) => {
    sqliteDB.all('SELECT * FROM gallery_items', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Found ${rows.length} gallery items to migrate`);
      
      for (const item of rows as any[]) {
        const existing = await GalleryItem.findOne({ id: item.id });
        if (!existing) {
          const newItem = new GalleryItem({
            id: item.id,
            title: item.title,
            category: item.category,
            image_filename: item.image_filename,
            image_path: item.image_path,
            order_index: item.order_index,
            created_at: item.created_at,
            updated_at: item.updated_at
          });
          
          await newItem.save();
        }
      }
      
      console.log('✅ Gallery items migrated');
      resolve();
    });
  });
}

async function migrateContactInquiries(sqliteDB: sqlite3.Database) {
  console.log('Migrating contact inquiries...');
  
  return new Promise<void>((resolve, reject) => {
    sqliteDB.all('SELECT * FROM contact_inquiries', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Found ${rows.length} inquiries to migrate`);
      
      for (const inquiry of rows as any[]) {
        const existing = await ContactInquiry.findOne({ id: inquiry.id });
        if (!existing) {
          const newInquiry = new ContactInquiry({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            service: inquiry.service,
            message: inquiry.message,
            status: inquiry.status,
            created_at: inquiry.created_at,
            updated_at: inquiry.updated_at
          });
          
          await newInquiry.save();
        }
      }
      
      console.log('✅ Contact inquiries migrated');
      resolve();
    });
  });
}

async function migrateCategories() {
  console.log('Migrating categories...');
  
  // Categories are currently in memory storage (storage.ts)
  const categories = [
    { name: "Mattresses", slug: "mattresses", description: "Premium memory foam, coir, and orthopedic mattresses", icon: "Bed" },
    { name: "Curtains", slug: "curtains", description: "Beautiful curtains with custom stitching available", icon: "Blinds" },
    { name: "Sofas", slug: "sofas", description: "Sofa making and repairing services", icon: "Armchair" },
    { name: "Wallpapers", slug: "wallpapers", description: "Imported wallpapers and 3D designs", icon: "Wallpaper" },
    { name: "Flooring", slug: "flooring", description: "PVC and vinyl flooring solutions", icon: "Grid" },
    { name: "Carpets", slug: "carpets", description: "Designer rugs and carpets", icon: "Layout" },
    { name: "Blinds", slug: "blinds", description: "Window blinds for light control", icon: "Minimize2" },
    { name: "Artificial Grass", slug: "artificial-grass", description: "Lively artificial grass for outdoor spaces", icon: "Trees" }
  ];
  
  for (const category of categories) {
    const existing = await Category.findOne({ slug: category.slug });
    if (!existing) {
      const newCategory = new Category({
        id: randomUUID(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon
      });
      
      await newCategory.save();
    }
  }
  
  console.log('✅ Categories migrated');
}

// Run migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateSQLiteToMongoDB().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export { migrateSQLiteToMongoDB };
