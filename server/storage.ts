import { randomUUID } from "crypto";
import { dbAll, dbGet, dbRun } from "./database";
import { Product, GalleryItem, ContactInquiry, Category, connectToMongoDB } from "./mongodb";

// Database configuration - set to 'sqlite' or 'mongodb'
const DB_TYPE = process.env.DB_TYPE || 'sqlite';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

type InsertProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

type InsertCategory = Omit<Category, 'id'>;

type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
};

type InsertContactInquiry = Omit<ContactInquiry, 'id' | 'status' | 'created_at' | 'updated_at'>;

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type InsertGalleryItem = Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>;

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  getContactInquiries(): Promise<ContactInquiry[]>;
  getContactInquiryById(id: string): Promise<ContactInquiry | undefined>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  updateContactInquiryStatus(id: string, status: ContactInquiry['status']): Promise<ContactInquiry | undefined>;
  deleteContactInquiry(id: string): Promise<boolean>;

  getGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItemById(id: string): Promise<GalleryItem | undefined>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: string, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private initialized: boolean = false;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    
    // Initialize MongoDB if configured
    if (DB_TYPE === 'mongodb') {
      this.initializeMongoDB();
    }
    
    this.seedData();
  }

  private async initializeMongoDB() {
    const connected = await connectToMongoDB();
    if (connected) {
      this.initialized = true;
      console.log('MongoDB initialized successfully');
    } else {
      console.error('Failed to initialize MongoDB');
    }
  }



  private seedData() {
    const categories: InsertCategory[] = [
      {
        name: "Mattresses",
        slug: "mattresses",
        description: "Premium memory foam, coir, and orthopedic mattresses",
        icon: "Bed",
      },
      {
        name: "Curtains",
        slug: "curtains",
        description: "Beautiful curtains with custom stitching available",
        icon: "Blinds",
      },
      {
        name: "Sofas",
        slug: "sofas",
        description: "Sofa making and repairing services",
        icon: "Armchair",
      },
      {
        name: "Wallpapers",
        slug: "wallpapers",
        description: "Imported wallpapers and 3D designs",
        icon: "Wallpaper",
      },
      {
        name: "Flooring",
        slug: "flooring",
        description: "PVC and vinyl flooring solutions",
        icon: "Grid",
      },
      {
        name: "Carpets",
        slug: "carpets",
        description: "Designer rugs and carpets",
        icon: "Layout",
      },
      {
        name: "Blinds",
        slug: "blinds",
        description: "Window blinds for light control",
        icon: "Minimize2",
      },
      {
        name: "Artificial Grass",
        slug: "artificial-grass",
        description: "Lively artificial grass for outdoor spaces",
        icon: "Trees",
      },
    ];

    categories.forEach((cat) => {
      const id = randomUUID();
      this.categories.set(id, { ...cat, id });
    });

    const products: InsertProduct[] = [
      {
        name: "Memory Foam Mattress",
        category: "Mattresses",
        description: "Premium memory foam mattress with orthopedic support for perfect sleep comfort",
        image_filename: "memoryfoam.webp",
        image_path: "/generated_images/memoryfoam.webp",
        order_index: 0,
      },
      {
        name: "Coir Mattress",
        category: "Mattresses",
        description: "Natural coir mattress for firm support and durability and comfort",
        image_filename: "choir.webp",
        image_path: "/generated_images/choir.webp",
        order_index: 1,
      },
      {
        name: "Designer Curtains",
        category: "Curtains",
        description: "Elegant designer curtains with custom stitching in various fabrics",
        image_filename: "designercurtain.webp",
        image_path: "/generated_images/designercurtain.webp",
        order_index: 2,
      },
      {
        name: "Blackout Curtains",
        category: "Curtains",
        description: "Light-blocking curtains for complete privacy",
        image_filename: "blackoutcurtain.webp",
        image_path: "/generated_images/blackoutcurtain.webp",
        order_index: 3,
      },
      {
        name: "L-Shape Sofa",
        category: "Sofas",
        description: "Modern L-shaped sofa with premium upholstery",
        image_filename: "Lshapesofa.webp",
        image_path: "/generated_images/Lshapesofa.webp",
        order_index: 4,
      },
      {
        name: "3-Seater Sofa",
        category: "Sofas",
        description: "Comfortable 3-seater sofa for living rooms",
        image_filename: "3sofa.webp",
        image_path: "/generated_images/3sofa.webp",
        order_index: 5,
      },
      {
        name: "3D Wallpaper",
        category: "Wallpapers",
        description: "Stunning 3D wallpaper designs for modern interiors",
        image_filename: "3dwallpaper.webp",
        image_path: "/generated_images/3dwallpaper.webp",
        order_index: 6,
      },
      {
        name: "Imported Wallpaper",
        category: "Wallpapers",
        description: "Premium imported wallpaper with unique patterns",
        image_filename: "importedwallpaper.webp",
        image_path: "/generated_images/importedwallpaper.webp",
        order_index: 7,
      },
      {
        name: "PVC Flooring",
        category: "Flooring",
        description: "Durable PVC flooring in wood texture patterns",
        image_filename: "pvcfloor.webp",
        image_path: "/generated_images/pvcfloor.webp",
        order_index: 8,
      },
      {
        name: "Vinyl Flooring",
        category: "Flooring",
        description: "Water-resistant vinyl flooring for modern homes",
        image_filename: "vinylfloor.webp",
        image_path: "/generated_images/vinylfloor.webp",
        order_index: 9,
      },
      {
        name: "Designer Carpet",
        category: "Carpets",
        description: "Elegant designer carpet for living spaces",
        image_filename: "designercarpet.webp",
        image_path: "/generated_images/designercarpet.webp",
        order_index: 10,
      },
      {
        name: "Door Mat",
        category: "Carpets",
        description: "Functional and stylish door mats",
        image_filename: "doormat.webp",
        image_path: "/generated_images/doormat.webp",
        order_index: 11,
      },
      {
        name: "Roller Blinds",
        category: "Blinds",
        description: "Easy-to-use roller blinds for windows",
        image_filename: "rollerblind.webp",
        image_path: "/generated_images/rollerblind.webp",
        order_index: 12,
      },
      {
        name: "Vertical Blinds",
        category: "Blinds",
        description: "Vertical blinds for large windows and doors",
        image_filename: "verticalblind.webp",
        image_path: "/generated_images/verticalblind.webp",
        order_index: 13,
      },
      {
        name: "Balcony Grass",
        category: "Artificial Grass",
        description: "UV-resistant artificial grass for balconies",
        image_filename: "balconygrass.webp",
        image_path: "/generated_images/balconygrass.webp",
        order_index: 14,
      },
    ];

    // No longer seed products into memory - they come from database
    // This MemStorage class is being phased out in favor of DB storage
  }

  async getProducts(): Promise<Product[]> {
    try {
      if (DB_TYPE === 'mongodb') {
        const products = await Product.find().sort({ order_index: 1, created_at: -1 });
        return products.map(p => p.toObject());
      } else {
        const products = await dbAll(
          'SELECT * FROM products ORDER BY order_index ASC, created_at DESC'
        );
        return products || [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      if (DB_TYPE === 'mongodb') {
        const product = await Product.findOne({ id });
        return product ? product.toObject() : undefined;
      } else {
        const product = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
        return product;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();
      
      if (DB_TYPE === 'mongodb') {
        const productData = {
          ...insertProduct,
          id,
          created_at: now,
          updated_at: now
        };
        const product = new Product(productData);
        await product.save();
        return product.toObject();
      } else {
        await dbRun(
          `INSERT INTO products (id, name, category, description, image_filename, image_path, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, insertProduct.name, insertProduct.category, insertProduct.description, insertProduct.image_filename, insertProduct.image_path, insertProduct.order_index, now, now]
        );
        return { ...insertProduct, id, created_at: now, updated_at: now };
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const product = await this.getProductById(id);
      if (!product) return undefined;

      const now = new Date().toISOString();
      const updated: Product = { ...product, ...updates, updated_at: now };

      if (DB_TYPE === 'mongodb') {
        await Product.updateOne({ id }, { $set: updated });
        const updatedProduct = await Product.findOne({ id });
        return updatedProduct ? updatedProduct.toObject() : undefined;
      } else {
        await dbRun(
          `UPDATE products SET name = ?, category = ?, description = ?, image_filename = ?, image_path = ?, order_index = ?, updated_at = ? WHERE id = ?`,
          [updated.name, updated.category, updated.description, updated.image_filename, updated.image_path, updated.order_index, updated.updated_at, id]
        );
      }

      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      if (DB_TYPE === 'mongodb') {
        await Product.deleteOne({ id });
      } else {
        await dbRun('DELETE FROM products WHERE id = ?', [id]);
      }
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      if (DB_TYPE === 'mongodb') {
        const categories = await Category.find();
        return categories.map(c => c.toObject());
      } else {
        return Array.from(this.categories.values());
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return Array.from(this.categories.values());
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      if (DB_TYPE === 'mongodb') {
        const category = await Category.findOne({ slug });
        return category ? category.toObject() : undefined;
      } else {
        return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
      }
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    
    try {
      if (DB_TYPE === 'mongodb') {
        const newCategory = new Category(category);
        await newCategory.save();
        return newCategory.toObject();
      } else {
        this.categories.set(id, category);
        return category;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      this.categories.set(id, category);
      return category;
    }
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    try {
      if (DB_TYPE === 'mongodb') {
        const inquiries = await ContactInquiry.find().sort({ created_at: -1 });
        return inquiries.map(inq => {
          const data = inq.toObject();
          return {
            ...data,
            status: data.status as 'unread' | 'read' | 'responded'
          };
        });
      } else {
        const inquiries = await dbAll(
          'SELECT * FROM contact_inquiries ORDER BY created_at DESC'
        );
        return inquiries || [];
      }
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      return [];
    }
  }

  async getContactInquiryById(id: string): Promise<ContactInquiry | undefined> {
    try {
      if (DB_TYPE === 'mongodb') {
        const inquiry = await ContactInquiry.findOne({ id });
        if (!inquiry) return undefined;
        const data = inquiry.toObject();
        return {
          ...data,
          status: data.status as 'unread' | 'read' | 'responded'
        };
      } else {
        const inquiry = await dbGet(
          'SELECT * FROM contact_inquiries WHERE id = ?',
          [id]
        );
        return inquiry;
      }
    } catch (error) {
      console.error('Error fetching contact inquiry:', error);
      return undefined;
    }
  }

  async createContactInquiry(
    insertInquiry: InsertContactInquiry
  ): Promise<ContactInquiry> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const inquiry: ContactInquiry = {
      ...insertInquiry,
      id,
      status: 'unread',
      created_at: now,
      updated_at: now
    };

    try {
      if (DB_TYPE === 'mongodb') {
        const newInquiry = new ContactInquiry(inquiry);
        await newInquiry.save();
        const data = newInquiry.toObject();
        return {
          ...data,
          status: data.status as 'unread' | 'read' | 'responded'
        };
      } else {
        await dbRun(
          `INSERT INTO contact_inquiries 
           (id, name, email, phone, service, message, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            inquiry.id,
            inquiry.name,
            inquiry.email,
            inquiry.phone,
            inquiry.service,
            inquiry.message,
            inquiry.status,
            inquiry.created_at,
            inquiry.updated_at
          ]
        );
        return inquiry;
      }
    } catch (error) {
      console.error('Error creating contact inquiry:', error);
      throw error;
    }
  }

  async updateContactInquiryStatus(id: string, status: ContactInquiry['status']): Promise<ContactInquiry | undefined> {
    try {
      const inquiry = await this.getContactInquiryById(id);
      if (!inquiry) return undefined;

      const now = new Date().toISOString();
      
      if (DB_TYPE === 'mongodb') {
        await ContactInquiry.updateOne({ id }, { $set: { status, updated_at: now } });
        return this.getContactInquiryById(id);
      } else {
        await dbRun(
          'UPDATE contact_inquiries SET status = ?, updated_at = ? WHERE id = ?',
          [status, now, id]
        );
      }

      return { ...inquiry, status, updated_at: now };
    } catch (error) {
      console.error('Error updating contact inquiry status:', error);
      return undefined;
    }
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    try {
      if (DB_TYPE === 'mongodb') {
        await ContactInquiry.deleteOne({ id });
      } else {
        await dbRun('DELETE FROM contact_inquiries WHERE id = ?', [id]);
      }
      return true;
    } catch (error) {
      console.error('Error deleting contact inquiry:', error);
      return false;
    }
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      if (DB_TYPE === 'mongodb') {
        const items = await GalleryItem.find().sort({ order_index: 1, created_at: -1 });
        return items.map(item => item.toObject());
      } else {
        const items = await dbAll(
          'SELECT * FROM gallery_items ORDER BY order_index ASC, created_at DESC'
        );
        return items;
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | undefined> {
    try {
      if (DB_TYPE === 'mongodb') {
        const item = await GalleryItem.findOne({ id });
        return item ? item.toObject() : undefined;
      } else {
        const item = await dbGet(
          'SELECT * FROM gallery_items WHERE id = ?',
          [id]
        );
        return item;
      }
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return undefined;
    }
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    try {
      if (DB_TYPE === 'mongodb') {
        const itemData = {
          ...insertItem,
          id,
          created_at: now,
          updated_at: now
        };
        const item = new GalleryItem(itemData);
        await item.save();
        return item.toObject();
      } else {
        await dbRun(
          `INSERT INTO gallery_items (id, title, category, image_filename, image_path, order_index, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, insertItem.title, insertItem.category, insertItem.image_filename, insertItem.image_path, insertItem.order_index, now, now]
        );
        
        const item = await this.getGalleryItemById(id);
        return item!;
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  async updateGalleryItem(id: string, insertItem: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    try {
      const existing = await this.getGalleryItemById(id);
      if (!existing) return undefined;

      const now = new Date().toISOString();
      const updates = { ...existing, ...insertItem, id, updated_at: now };

      if (DB_TYPE === 'mongodb') {
        await GalleryItem.updateOne({ id }, { $set: updates });
        return this.getGalleryItemById(id);
      } else {
        await dbRun(
          `UPDATE gallery_items SET title = ?, category = ?, image_filename = ?, image_path = ?, order_index = ?, updated_at = ?
           WHERE id = ?`,
          [updates.title, updates.category, updates.image_filename, updates.image_path, updates.order_index, now, id]
        );

        return this.getGalleryItemById(id);
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return undefined;
    }
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      if (DB_TYPE === 'mongodb') {
        await GalleryItem.deleteOne({ id });
      } else {
        await dbRun('DELETE FROM gallery_items WHERE id = ?', [id]);
      }
      return true;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();
