import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { dbAll, dbGet, dbRun } from "./database";

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
  private enquiriesFile: string;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.enquiriesFile = join(process.cwd(), 'enquiries.json');
    this.seedData();
    this.ensureEnquiriesFile();
  }

  private ensureEnquiriesFile() {
    if (!existsSync(this.enquiriesFile)) {
      writeFileSync(this.enquiriesFile, JSON.stringify([], null, 2));
    }
  }

  private readEnquiries(): ContactInquiry[] {
    try {
      const data = readFileSync(this.enquiriesFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeEnquiries(enquiries: ContactInquiry[]) {
    writeFileSync(this.enquiriesFile, JSON.stringify(enquiries, null, 2));
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
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return this.readEnquiries();
  }

  async getContactInquiryById(id: string): Promise<ContactInquiry | undefined> {
    const enquiries = this.readEnquiries();
    return enquiries.find(e => e.id === id);
  }

  async createContactInquiry(
    insertInquiry: InsertContactInquiry
  ): Promise<ContactInquiry> {
    const enquiries = this.readEnquiries();
    const id = randomUUID();
    const now = new Date().toISOString();
    const inquiry: ContactInquiry = {
      ...insertInquiry,
      id,
      status: 'unread',
      created_at: now,
      updated_at: now
    };
    enquiries.push(inquiry);
    this.writeEnquiries(enquiries);
    return inquiry;
  }

  async updateContactInquiryStatus(id: string, status: ContactInquiry['status']): Promise<ContactInquiry | undefined> {
    const enquiries = this.readEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return undefined;

    enquiries[index].status = status;
    enquiries[index].updated_at = new Date().toISOString();
    this.writeEnquiries(enquiries);
    return enquiries[index];
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    const enquiries = this.readEnquiries();
    const filtered = enquiries.filter(e => e.id !== id);
    if (filtered.length === enquiries.length) return false;

    this.writeEnquiries(filtered);
    return true;
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
