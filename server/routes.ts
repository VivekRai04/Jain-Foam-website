import type { Express } from "express";
import { createServer, type Server } from "http";
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


  const httpServer = createServer(app);

  return httpServer;
}
