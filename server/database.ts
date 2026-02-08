import { connectToDatabase, getProductsCollection, getGalleryCollection, getContactInquiriesCollection, getCategoriesCollection } from './mongodb';

// Database initialization - connects to MongoDB
export async function initializeDatabase() {
  try {
    await connectToDatabase();
    console.log('Database initialized successfully');
    
    // Seed initial data if collections are empty
    await seedInitialData();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function seedInitialData() {
  try {
    // Seed gallery items
    const galleryCollection = await getGalleryCollection();
    const galleryCount = await galleryCollection.countDocuments();
    
    if (galleryCount === 0) {
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
        const { randomUUID: uuid } = await import('crypto');
        const id = uuid();
        
        await galleryCollection.insertOne({
          ...item,
          id,
          order_index: i,
          created_at: now,
          updated_at: now
        });
      }
      console.log('Gallery items seeded successfully');
    }

    // Seed products
    const productsCollection = await getProductsCollection();
    const productCount = await productsCollection.countDocuments();
    
    if (productCount === 0) {
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

      const { randomUUID: uuid } = await import('crypto');
      
      for (let i = 0; i < initialProducts.length; i++) {
        const prod = initialProducts[i];
        const id = uuid();
        
        await productsCollection.insertOne({
          ...prod,
          id,
          order_index: i,
          created_at: now,
          updated_at: now
        });
      }
      console.log('Products seeded successfully');
    }

    // Migrate existing JSON enquiries to MongoDB
    await migrateEnquiriesFromJSON();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

async function migrateEnquiriesFromJSON() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const enquiriesFile = path.join(process.cwd(), 'enquiries.json');
    
    if (fs.existsSync(enquiriesFile)) {
      const enquiriesData = fs.readFileSync(enquiriesFile, 'utf-8');
      const enquiries = JSON.parse(enquiriesData);
      
      if (enquiries.length > 0) {
        const inquiriesCollection = await getContactInquiriesCollection();
        const existingCount = await inquiriesCollection.countDocuments();
        
        if (existingCount === 0) {
          const { randomUUID: uuid } = await import('crypto');
          
          for (const inquiry of enquiries) {
            const now = new Date().toISOString();
            await inquiriesCollection.insertOne({
              ...inquiry,
              id: inquiry.id || uuid(),
              created_at: inquiry.created_at || now,
              updated_at: inquiry.updated_at || now
            });
          }
          console.log(`Successfully migrated ${enquiries.length} enquiries from JSON to MongoDB`);
        }
      }
    }
  } catch (error) {
    console.error('Error migrating enquiries from JSON:', error);
  }
}

// Re-export for backward compatibility
export { connectToDatabase, getProductsCollection, getGalleryCollection, getContactInquiriesCollection };
