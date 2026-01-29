import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import multer from "multer";
import { join } from "path";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { storage } from "./storage";
import { emailService } from "./email";

// Setup multer for image uploads
const uploadsDir = join(process.cwd(), 'uploads', 'gallery');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const inquiry = await storage.createContactInquiry(req.body);

      // Send email notification asynchronously (don't wait for it)
      emailService.sendContactInquiryEmail(req.body).catch((emailError) => {
        console.error("Failed to send contact inquiry email:", emailError);
        // Don't fail the request if email fails
      });

      res.json({
        success: true,
        message: "Your inquiry has been submitted successfully. We'll contact you soon!",
        inquiryId: inquiry.id,
      });
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(400).json({ error: "Failed to submit inquiry" });
    }
  });

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.session?.admin) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  };

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        return res.status(500).json({ error: "Admin password not configured" });
      }

      const isValid = await bcrypt.compare(password, adminPassword);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      req.session.admin = true;
      res.json({ success: true });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Simple endpoint for the client to verify admin session
  app.get("/api/admin/check", (req, res) => {
    if (req.session?.admin) {
      return res.json({ authenticated: true });
    }
    res.status(401).json({ error: "Unauthorized" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/enquiries", requireAdmin, async (req, res) => {
    try {
      const enquiries = await storage.getContactInquiries();
      res.json(enquiries);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  });

  app.put("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const enquiry = await storage.updateContactInquiryStatus(req.params.id, status);
      if (!enquiry) {
        return res.status(404).json({ error: "Enquiry not found" });
      }
      res.json(enquiry);
    } catch (error) {
      console.error("Error updating enquiry:", error);
      res.status(500).json({ error: "Failed to update enquiry" });
    }
  });

  app.delete("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteContactInquiry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Enquiry not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      res.status(500).json({ error: "Failed to delete enquiry" });
    }
  });

  // Gallery endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const item = await storage.getGalleryItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching gallery item:", error);
      res.status(500).json({ error: "Failed to fetch gallery item" });
    }
  });

  // Admin gallery upload endpoint
  app.post("/api/admin/gallery/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const { title, category } = req.body;
      if (!title || !category) {
        unlinkSync(req.file.path);
        return res.status(400).json({ error: "Title and category are required" });
      }

      const filename = req.file.filename;
      const imagePath = `/uploads/gallery/${filename}`;

      const item = await storage.createGalleryItem({
        title,
        category,
        image_filename: filename,
        image_path: imagePath,
        order_index: 0,
      });

      res.json({ success: true, item });
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      if (req.file) {
        try {
          unlinkSync(req.file.path);
        } catch (e) {
          console.error("Error deleting uploaded file:", e);
        }
      }
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Admin gallery update endpoint
  app.put("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const { title, category, order_index } = req.body;
      const item = await storage.updateGalleryItem(req.params.id, {
        title,
        category,
        order_index,
      });

      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      res.json({ success: true, item });
    } catch (error) {
      console.error("Error updating gallery item:", error);
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  });

  // Admin gallery delete endpoint
  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const item = await storage.getGalleryItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      // Delete the file from disk
      const filePath = join(uploadsDir, item.image_filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      // Delete from database
      await storage.deleteGalleryItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  });

  // Admin products CRUD endpoints
  app.post("/api/admin/products/upload", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const { name, category, description } = req.body;

      if (!name || !category || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const product = await storage.createProduct({
        name,
        category,
        description,
        image_filename: req.file.filename,
        image_path: `/uploads/${req.file.filename}`,
        order_index: 0,
      });

      res.json({ success: true, product });
    } catch (error) {
      console.error("Error uploading product:", error);
      res.status(500).json({ error: "Failed to upload product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const { name, category, description, order_index } = req.body;
      const product = await storage.updateProduct(req.params.id, {
        name,
        category,
        description,
        order_index,
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ success: true, product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Delete the file from disk if it's in uploads
      if (product.image_path.includes('/uploads/')) {
        const filePath = join(uploadsDir, product.image_filename);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      }

      // Delete from database
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
