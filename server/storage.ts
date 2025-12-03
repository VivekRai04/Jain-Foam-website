import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
};

type InsertProduct = Omit<Product, 'id'>;

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

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  getContactInquiries(): Promise<ContactInquiry[]>;
  getContactInquiryById(id: string): Promise<ContactInquiry | undefined>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  updateContactInquiryStatus(id: string, status: ContactInquiry['status']): Promise<ContactInquiry | undefined>;
  deleteContactInquiry(id: string): Promise<boolean>;
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
        imageUrl: "/generated_images/memoryfoam.webp",
      },
      {
        name: "Coir Mattress",
        category: "Mattresses",
        description: "Natural coir mattress for firm support and durability and comfort",
        imageUrl: "/generated_images/choir.webp",
      },
      {
        name: "Designer Curtains",
        category: "Curtains",
        description: "Elegant designer curtains with custom stitching in various fabrics",
        imageUrl: "/generated_images/designercurtain.webp",
      },
      {
        name: "Blackout Curtains",
        category: "Curtains",
        description: "Light-blocking curtains for complete privacy",
        imageUrl: "/generated_images/blackoutcurtain.webp",
      },
      {
        name: "L-Shape Sofa",
        category: "Sofas",
        description: "Modern L-shaped sofa with premium upholstery",
        imageUrl: "/generated_images/Lshapesofa.webp",
      },
      {
        name: "3-Seater Sofa",
        category: "Sofas",
        description: "Comfortable 3-seater sofa for living rooms",
        imageUrl: "/generated_images/3sofa.webp",
      },
      {
        name: "3D Wallpaper",
        category: "Wallpapers",
        description: "Stunning 3D wallpaper designs for modern interiors",
        imageUrl: "/generated_images/3dwallpaper.webp",
      },
      {
        name: "Imported Wallpaper",
        category: "Wallpapers",
        description: "Premium imported wallpaper with unique patterns",
        imageUrl: "/generated_images/importedwallpaper.webp",
      },
      {
        name: "PVC Flooring",
        category: "Flooring",
        description: "Durable PVC flooring in wood texture patterns",
        imageUrl: "/generated_images/pvcfloor.webp",
      },
      {
        name: "Vinyl Flooring",
        category: "Flooring",
        description: "Water-resistant vinyl flooring for modern homes",
        imageUrl: "/generated_images/vinylfloor.webp",
      },
      {
        name: "Designer Carpet",
        category: "Carpets",
        description: "Elegant designer carpet for living spaces",
        imageUrl: "/generated_images/designercarpet.webp",
      },
      {
        name: "Door Mat",
        category: "Carpets",
        description: "Functional and stylish door mats",
        imageUrl: "/generated_images/doormat.webp",
      },
      {
        name: "Roller Blinds",
        category: "Blinds",
        description: "Easy-to-use roller blinds for windows",
        imageUrl: "/generated_images/rollerblind.webp",
      },
      {
        name: "Vertical Blinds",
        category: "Blinds",
        description: "Vertical blinds for large windows and doors",
        imageUrl: "/generated_images/verticalblind.webp",
      },
      {
        name: "Balcony Grass",
        category: "Artificial Grass",
        description: "UV-resistant artificial grass for balconies",
        imageUrl: "/generated_images/balconygrass.webp",
      },
    ];

    products.forEach((prod) => {
      const id = randomUUID();
      this.products.set(id, { ...prod, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
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
}

export const storage = new MemStorage();
