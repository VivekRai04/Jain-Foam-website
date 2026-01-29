import sqlite3 from 'sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const dbPath = join(process.cwd(), 'data', 'app.db');

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

export async function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Gallery items table
      db.run(
        `CREATE TABLE IF NOT EXISTS gallery_items (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          image_filename TEXT NOT NULL,
          image_path TEXT NOT NULL,
          order_index INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error('Error creating gallery_items table:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );

      // Products table
      db.run(
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          image_filename TEXT NOT NULL,
          image_path TEXT NOT NULL,
          order_index INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error('Error creating products table:', err);
          } else {
            seedInitialData();
          }
        }
      );
    });
  });
}

async function seedInitialData() {
  try {
    // Seed gallery items
    const galleryCount = await dbGet('SELECT COUNT(*) as count FROM gallery_items');
    if (galleryCount && galleryCount.count === 0) {
      const { randomUUID } = await import('crypto');
      const now = new Date().toISOString();
      
      const initialGalleryItems = [
        {
          title: 'Luxury Living Room Setup',
          category: 'Sofas',
          image_path: '/generated_images/Hero_living_room_showcase_416398aa.webp',
          image_filename: 'Hero_living_room_showcase_416398aa.webp',
        },
        {
          title: 'Premium Memory Foam Mattress',
          category: 'Mattresses',
          image_path: '/generated_images/Mattress_product_photo_73a5ba87.webp',
          image_filename: 'Mattress_product_photo_73a5ba87.webp',
        },
        {
          title: 'Elegant Designer Curtains',
          category: 'Curtains',
          image_path: '/generated_images/Curtains_product_photo_f7e29867.webp',
          image_filename: 'Curtains_product_photo_f7e29867.webp',
        },
        {
          title: 'Modern Comfort Sofa',
          category: 'Sofas',
          image_path: '/generated_images/Sofa_product_photo_ddab7fc9.webp',
          image_filename: 'Sofa_product_photo_ddab7fc9.webp',
        },
        {
          title: '3D Geometric Wallpaper',
          category: 'Wallpapers',
          image_path: '/generated_images/Wallpaper_product_photo_065f0180.webp',
          image_filename: 'Wallpaper_product_photo_065f0180.webp',
        },
        {
          title: 'PVC Wood Texture Flooring',
          category: 'Carpets',
          image_path: '/generated_images/Flooring_product_photo_9f959715.webp',
          image_filename: 'Flooring_product_photo_9f959715.webp',
        },
      ];

      for (let i = 0; i < initialGalleryItems.length; i++) {
        const item = initialGalleryItems[i];
        const id = randomUUID();
        await dbRun(
          `INSERT INTO gallery_items (id, title, category, image_filename, image_path, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, item.title, item.category, item.image_filename, item.image_path, i, now, now]
        );
      }
      console.log('Gallery items seeded successfully');
    }

    // Seed products
    const productCount = await dbGet('SELECT COUNT(*) as count FROM products');
    if (productCount && productCount.count === 0) {
      const { randomUUID } = await import('crypto');
      const now = new Date().toISOString();
      
      const initialProducts = [
        {
          name: "Memory Foam Mattress",
          category: "Mattresses",
          description: "Premium memory foam mattress with orthopedic support for perfect sleep comfort",
          image_path: "/generated_images/memoryfoam.webp",
          image_filename: "memoryfoam.webp",
        },
        {
          name: "Coir Mattress",
          category: "Mattresses",
          description: "Natural coir mattress for firm support and durability and comfort",
          image_path: "/generated_images/choir.webp",
          image_filename: "choir.webp",
        },
        {
          name: "Designer Curtains",
          category: "Curtains",
          description: "Elegant designer curtains with custom stitching in various fabrics",
          image_path: "/generated_images/designercurtain.webp",
          image_filename: "designercurtain.webp",
        },
        {
          name: "Blackout Curtains",
          category: "Curtains",
          description: "Light-blocking curtains for complete privacy",
          image_path: "/generated_images/blackoutcurtain.webp",
          image_filename: "blackoutcurtain.webp",
        },
        {
          name: "L-Shape Sofa",
          category: "Sofas",
          description: "Modern L-shaped sofa with premium upholstery",
          image_path: "/generated_images/Lshapesofa.webp",
          image_filename: "Lshapesofa.webp",
        },
        {
          name: "3-Seater Sofa",
          category: "Sofas",
          description: "Comfortable 3-seater sofa for living rooms",
          image_path: "/generated_images/3sofa.webp",
          image_filename: "3sofa.webp",
        },
        {
          name: "3D Wallpaper",
          category: "Wallpapers",
          description: "Stunning 3D wallpaper designs for modern interiors",
          image_path: "/generated_images/3dwallpaper.webp",
          image_filename: "3dwallpaper.webp",
        },
        {
          name: "Imported Wallpaper",
          category: "Wallpapers",
          description: "Premium imported wallpaper with unique patterns",
          image_path: "/generated_images/importedwallpaper.webp",
          image_filename: "importedwallpaper.webp",
        },
        {
          name: "PVC Flooring",
          category: "Flooring",
          description: "Durable PVC flooring in wood texture patterns",
          image_path: "/generated_images/pvcfloor.webp",
          image_filename: "pvcfloor.webp",
        },
        {
          name: "Vinyl Flooring",
          category: "Flooring",
          description: "Water-resistant vinyl flooring for modern homes",
          image_path: "/generated_images/vinylfloor.webp",
          image_filename: "vinylfloor.webp",
        },
        {
          name: "Designer Carpet",
          category: "Carpets",
          description: "Elegant designer carpet for living spaces",
          image_path: "/generated_images/designercarpet.webp",
          image_filename: "designercarpet.webp",
        },
        {
          name: "Door Mat",
          category: "Carpets",
          description: "Functional and stylish door mats",
          image_path: "/generated_images/doormat.webp",
          image_filename: "doormat.webp",
        },
        {
          name: "Roller Blinds",
          category: "Blinds",
          description: "Easy-to-use roller blinds for windows",
          image_path: "/generated_images/rollerblind.webp",
          image_filename: "rollerblind.webp",
        },
        {
          name: "Vertical Blinds",
          category: "Blinds",
          description: "Vertical blinds for large windows and doors",
          image_path: "/generated_images/verticalblind.webp",
          image_filename: "verticalblind.webp",
        },
        {
          name: "Balcony Grass",
          category: "Artificial Grass",
          description: "UV-resistant artificial grass for balconies",
          image_path: "/generated_images/balconygrass.webp",
          image_filename: "balconygrass.webp",
        },
      ];

      for (let i = 0; i < initialProducts.length; i++) {
        const prod = initialProducts[i];
        const id = randomUUID();
        await dbRun(
          `INSERT INTO products (id, name, category, description, image_filename, image_path, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, prod.name, prod.category, prod.description, prod.image_filename, prod.image_path, i, now, now]
        );
      }
      console.log('Products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Helper function to run queries that return rows
export function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Helper function to run a single query
export function dbGet(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper function to run a query without returning data
export function dbRun(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Helper function to insert and get the ID
export function dbInsert(sql: string, params: any[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID?.toString() || '');
    });
  });
}
