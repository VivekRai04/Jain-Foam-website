/**
 * Migration script to upload existing images to MongoDB GridFS
 * Run with: npx tsx server/migrate-images.ts
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { uploadFileToGridFS, connectToDatabase, closeConnection } from './mongodb';
import { getGalleryCollection, getProductsCollection } from './database';

const ASSETS_DIR = path.join(process.cwd(), 'attached_assets', 'generated_images');
const CLIENT_PUBLIC_DIR = path.join(process.cwd(), 'client', 'public', 'generated_images');

function findImageFile(filename: string): string | null {
  // Check attached_assets first
  const assetsPath = path.join(ASSETS_DIR, filename);
  if (fs.existsSync(assetsPath)) {
    return assetsPath;
  }
  
  // Check client/public
  const clientPath = path.join(CLIENT_PUBLIC_DIR, filename);
  if (fs.existsSync(clientPath)) {
    return clientPath;
  }
  
  return null;
}

async function migrateImages() {
  console.log('Starting image migration to GridFS...\n');

  try {
    await connectToDatabase();
    
    const galleryCollection = await getGalleryCollection();
    const productsCollection = await getProductsCollection();

    // Get gallery items that need migration (using disk paths)
    const galleryItems = await galleryCollection.find({
      image_path: { $regex: /^(\/attached_assets|\/generated_images)/ }
    }).toArray();
    console.log(`Found ${galleryItems.length} gallery items to migrate`);

    // Get products that need migration  
    const products = await productsCollection.find({
      image_path: { $regex: /^(\/attached_assets|\/generated_images)/ }
    }).toArray();
    console.log(`Found ${products.length} products to migrate\n`);

    let migratedGallery = 0;
    let migratedProducts = 0;

    // Migrate gallery images
    for (const item of galleryItems) {
      const filename = item.image_filename;
      const filepath = findImageFile(filename);
      
      if (filepath) {
        const fileBuffer = fs.readFileSync(filepath);
        const contentType = getContentType(filename);
        
        // Upload to GridFS
        const gridfsId = await uploadFileToGridFS(fileBuffer, filename, contentType);
        
        // Update database record
        await galleryCollection.updateOne(
          { id: item.id },
          { 
            $set: { 
              image_path: `/api/images/${gridfsId}`,
              image_gridfs_id: gridfsId.toString()
            }
          }
        );
        
        migratedGallery++;
        console.log(`✓ Migrated gallery image: ${filename}`);
      } else {
        console.log(`✗ Gallery file not found: ${filename}`);
      }
    }

    // Migrate product images
    for (const product of products) {
      const filename = product.image_filename;
      const filepath = findImageFile(filename);
      
      if (filepath) {
        const fileBuffer = fs.readFileSync(filepath);
        const contentType = getContentType(filename);
        
        // Upload to GridFS
        const gridfsId = await uploadFileToGridFS(fileBuffer, filename, contentType);
        
        // Update database record
        await productsCollection.updateOne(
          { id: product.id },
          { 
            $set: { 
              image_path: `/api/images/${gridfsId}`,
              image_gridfs_id: gridfsId.toString()
            }
          }
        );
        
        migratedProducts++;
        console.log(`✓ Migrated product image: ${filename}`);
      } else {
        console.log(`✗ Product file not found: ${filename}`);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Gallery images migrated: ${migratedGallery}`);
    console.log(`   Product images migrated: ${migratedProducts}`);
    console.log(`   Total: ${migratedGallery + migratedProducts}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await closeConnection();
    process.exit(0);
  }
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}

migrateImages();
