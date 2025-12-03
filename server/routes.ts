import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { emailService } from "./email";

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

  const httpServer = createServer(app);

  return httpServer;
}
