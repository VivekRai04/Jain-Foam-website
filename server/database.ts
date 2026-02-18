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
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433802/jain_foam/jain_foam/3dwallpaper.webp',
          image_filename: 'Hero_living_room_showcase_416398aa.webp',
        },
        {
          title: 'Premium Memory Foam Mattress',
          category: 'Mattresses',
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433815/jain_foam/jain_foam/Mattress_product_photo_73a5ba87.webp',
          image_filename: 'Mattress_product_photo_73a5ba87.webp',
        },
        {
          title: 'Elegant Designer Curtains',
          category: 'Curtains',
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433808/jain_foam/jain_foam/Curtains_product_photo_f7e29867.webp',
          image_filename: 'Curtains_product_photo_f7e29867.webp',
        },
        {
          title: 'Modern Comfort Sofa',
          category: 'Sofas',
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433820/jain_foam/jain_foam/Sofa_product_photo_ddab7fc9.webp',
          image_filename: 'Sofa_product_photo_ddab7fc9.webp',
        },
        {
          title: '3D Geometric Wallpaper',
          category: 'Wallpapers',
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433823/jain_foam/jain_foam/Wallpaper_product_photo_065f0180.webp',
          image_filename: 'Wallpaper_product_photo_065f0180.webp',
        },
        {
          title: 'PVC Wood Texture Flooring',
          category: 'Carpets',
          image_path: 'https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433812/jain_foam/jain_foam/Flooring_product_photo_9f959715.webp',
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
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433817/jain_foam/jain_foam/memoryfoam.webp",
          image_filename: "memoryfoam.webp",
        },
        {
          name: "Coir Mattress",
          category: "Mattresses",
          description: "Natural coir mattress for firm support and durability and comfort",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433806/jain_foam/jain_foam/choir.webp",
          image_filename: "choir.webp",
        },
        {
          name: "Designer Curtains",
          category: "Curtains",
          description: "Elegant designer curtains with custom stitching in various fabrics",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433810/jain_foam/jain_foam/designercurtain.webp",
          image_filename: "designercurtain.webp",
        },
        {
          name: "Blackout Curtains",
          category: "Curtains",
          description: "Light-blocking curtains for complete privacy",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433805/jain_foam/jain_foam/blackoutcurtain.webp",
          image_filename: "blackoutcurtain.webp",
        },
        {
          name: "L-Shape Sofa",
          category: "Sofas",
          description: "Modern L-shaped sofa with premium upholstery",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433814/jain_foam/jain_foam/Lshapesofa.webp",
          image_filename: "Lshapesofa.webp",
        },
        {
          name: "3-Seater Sofa",
          category: "Sofas",
          description: "Comfortable 3-seater sofa for living rooms",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433803/jain_foam/jain_foam/3sofa.webp",
          image_filename: "3sofa.webp",
        },
        {
          name: "3D Wallpaper",
          category: "Wallpapers",
          description: "Stunning 3D wallpaper designs for modern interiors",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433802/jain_foam/jain_foam/3dwallpaper.webp",
          image_filename: "3dwallpaper.webp",
        },
        {
          name: "Imported Wallpaper",
          category: "Wallpapers",
          description: "Premium imported wallpaper with unique patterns",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433813/jain_foam/jain_foam/importedwallpaper.webp",
          image_filename: "importedwallpaper.webp",
        },
        {
          name: "PVC Flooring",
          category: "Flooring",
          description: "Durable PVC flooring in wood texture patterns",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433818/jain_foam/jain_foam/pvcfloor.webp",
          image_filename: "pvcfloor.webp",
        },
        {
          name: "Vinyl Flooring",
          category: "Flooring",
          description: "Water-resistant vinyl flooring for modern homes",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433822/jain_foam/jain_foam/vinylfloor.webp",
          image_filename: "vinylfloor.webp",
        },
        {
          name: "Designer Carpet",
          category: "Carpets",
          description: "Elegant designer carpet for living spaces",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433809/jain_foam/jain_foam/designercarpet.webp",
          image_filename: "designercarpet.webp",
        },
        {
          name: "Door Mat",
          category: "Carpets",
          description: "Functional and stylish door mats",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433811/jain_foam/jain_foam/doormat.webp",
          image_filename: "doormat.webp",
        },
        {
          name: "Roller Blinds",
          category: "Blinds",
          description: "Easy-to-use roller blinds for windows",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433819/jain_foam/jain_foam/rollerblind.webp",
          image_filename: "rollerblind.webp",
        },
        {
          name: "Vertical Blinds",
          category: "Blinds",
          description: "Vertical blinds for large windows and doors",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433821/jain_foam/jain_foam/verticalblind.webp",
          image_filename: "verticalblind.webp",
        },
        {
          name: "Balcony Grass",
          category: "Artificial Grass",
          description: "UV-resistant artificial grass for balconies",
          image_path: "https://res.cloudinary.com/dw3rgs0ku/image/upload/v1771433804/jain_foam/jain_foam/balconygrass.webp",
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
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Re-export for backward compatibility
export { connectToDatabase, getProductsCollection, getGalleryCollection, getContactInquiriesCollection };
