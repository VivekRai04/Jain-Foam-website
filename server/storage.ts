import { randomUUID } from "crypto";
import { dbAll, dbGet, dbRun } from "./database";

// Types
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
  private categories: Map<string, Category>;

  constructor() {
    this.categories = new Map();
    this.seedCategories();
  }

  private seedCategories() {
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
  }

  async getProducts(): Promise<Product[]> {
    try {
      const products = await dbAll(
        'SELECT * FROM products ORDER BY order_index ASC, created_at DESC'
      );
      return products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const product = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();
      
      await dbRun(
        `INSERT INTO products (id, name, category, description, image_filename, image_path, order_index, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, insertProduct.name, insertProduct.category, insertProduct.description, insertProduct.image_filename, insertProduct.image_path, insertProduct.order_index, now, now]
      );
      return { ...insertProduct, id, created_at: now, updated_at: now };
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

      await dbRun(
        `UPDATE products SET name = ?, category = ?, description = ?, image_filename = ?, image_path = ?, order_index = ?, updated_at = ? WHERE id = ?`,
        [updated.name, updated.category, updated.description, updated.image_filename, updated.image_path, updated.order_index, updated.updated_at, id]
      );

      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await dbRun('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return Array.from(this.categories.values());
    } catch (error) {
      console.error('Error fetching categories:', error);
      return Array.from(this.categories.values());
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    try {
      const inquiries = await dbAll(
        'SELECT * FROM contact_inquiries ORDER BY created_at DESC'
      );
      return inquiries || [];
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      return [];
    }
  }

  async getContactInquiryById(id: string): Promise<ContactInquiry | undefined> {
    try {
      const inquiry = await dbGet(
        'SELECT * FROM contact_inquiries WHERE id = ?',
        [id]
      );
      return inquiry;
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
      
      await dbRun(
        'UPDATE contact_inquiries SET status = ?, updated_at = ? WHERE id = ?',
        [status, now, id]
      );

      return { ...inquiry, status, updated_at: now };
    } catch (error) {
      console.error('Error updating contact inquiry status:', error);
      return undefined;
    }
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    try {
      await dbRun('DELETE FROM contact_inquiries WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting contact inquiry:', error);
      return false;
    }
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const items = await dbAll(
        'SELECT * FROM gallery_items ORDER BY order_index ASC, created_at DESC'
      );
      return items;
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | undefined> {
    try {
      const item = await dbGet(
        'SELECT * FROM gallery_items WHERE id = ?',
        [id]
      );
      return item;
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return undefined;
    }
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    try {
      await dbRun(
        `INSERT INTO gallery_items (id, title, category, image_filename, image_path, order_index, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, insertItem.title, insertItem.category, insertItem.image_filename, insertItem.image_path, insertItem.order_index, now, now]
      );
      
      const item = await this.getGalleryItemById(id);
      return item!;
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

      await dbRun(
        `UPDATE gallery_items SET title = ?, category = ?, image_filename = ?, image_path = ?, order_index = ?, updated_at = ?
         WHERE id = ?`,
        [updates.title, updates.category, updates.image_filename, updates.image_path, updates.order_index, now, id]
      );

      return this.getGalleryItemById(id);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return undefined;
    }
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      await dbRun('DELETE FROM gallery_items WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();
