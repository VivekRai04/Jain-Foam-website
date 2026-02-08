import { randomUUID } from "crypto";
import { 
  getGalleryCollection, 
  getProductsCollection, 
  getContactInquiriesCollection, 
  getCategoriesCollection,
  GalleryItem,
  Product,
  ContactInquiry,
  Category
} from "./mongodb";

// Types
export type InsertProduct = Omit<Product, '_id' | 'id' | 'created_at' | 'updated_at'>;

export type InsertCategory = Omit<Category, '_id' | 'id'>;

export type InsertContactInquiry = Omit<ContactInquiry, '_id' | 'id' | 'status' | 'created_at' | 'updated_at'>;

export type InsertGalleryItem = Omit<GalleryItem, '_id' | 'id' | 'created_at' | 'updated_at'>;

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
      const collection = await getProductsCollection();
      const products = await collection
        .find({})
        .sort({ order_index: 1, created_at: -1 })
        .toArray();
      return products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const collection = await getProductsCollection();
      const product = await collection.findOne({ id });
      return product || undefined;
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();
      
      const product: Product = {
        ...insertProduct,
        id,
        created_at: now,
        updated_at: now
      };
      
      const collection = await getProductsCollection();
      await collection.insertOne(product);
      return product;
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
      const updated: Product = { 
        ...product, 
        ...updates, 
        updated_at: now 
      };

      const collection = await getProductsCollection();
      await collection.updateOne(
        { id },
        { $set: { ...updates, updated_at: now } }
      );

      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const collection = await getProductsCollection();
      const result = await collection.deleteOne({ id });
      return result.deletedCount === 1;
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
      const collection = await getContactInquiriesCollection();
      const inquiries = await collection
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return inquiries || [];
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      return [];
    }
  }

  async getContactInquiryById(id: string): Promise<ContactInquiry | undefined> {
    try {
      const collection = await getContactInquiriesCollection();
      const inquiry = await collection.findOne({ id });
      return inquiry || undefined;
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
      const collection = await getContactInquiriesCollection();
      await collection.insertOne(inquiry);
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
      
      const collection = await getContactInquiriesCollection();
      await collection.updateOne(
        { id },
        { $set: { status, updated_at: now } }
      );

      return { ...inquiry, status, updated_at: now };
    } catch (error) {
      console.error('Error updating contact inquiry status:', error);
      return undefined;
    }
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    try {
      const collection = await getContactInquiriesCollection();
      const result = await collection.deleteOne({ id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting contact inquiry:', error);
      return false;
    }
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const collection = await getGalleryCollection();
      const items = await collection
        .find({})
        .sort({ order_index: 1, created_at: -1 })
        .toArray();
      return items || [];
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [];
    }
  }

  async getGalleryItemById(id: string): Promise<GalleryItem | undefined> {
    try {
      const collection = await getGalleryCollection();
      const item = await collection.findOne({ id });
      return item || undefined;
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return undefined;
    }
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    try {
      const id = randomUUID();
      const now = new Date().toISOString();
      
      const item: GalleryItem = {
        ...insertItem,
        id,
        created_at: now,
        updated_at: now
      };
      
      const collection = await getGalleryCollection();
      await collection.insertOne(item);
      return item;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  async updateGalleryItem(id: string, updates: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    try {
      const existing = await this.getGalleryItemById(id);
      if (!existing) return undefined;

      const now = new Date().toISOString();
      
      const collection = await getGalleryCollection();
      await collection.updateOne(
        { id },
        { $set: { ...updates, updated_at: now } }
      );

      return this.getGalleryItemById(id) as Promise<GalleryItem | undefined>;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return undefined;
    }
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const collection = await getGalleryCollection();
      const result = await collection.deleteOne({ id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();
