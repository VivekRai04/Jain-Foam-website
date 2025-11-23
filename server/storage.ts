import {
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type ContactInquiry,
  type InsertContactInquiry,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private contactInquiries: Map<string, ContactInquiry>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.contactInquiries = new Map();
    this.seedData();
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

  async createContactInquiry(
    insertInquiry: InsertContactInquiry
  ): Promise<ContactInquiry> {
    const id = randomUUID();
    const inquiry: ContactInquiry = { ...insertInquiry, id };
    this.contactInquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
