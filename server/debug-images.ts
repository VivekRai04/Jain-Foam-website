import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';
import { getProductsCollection } from './database';

async function debugImages() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    console.log('Connected to MongoDB\n');

    const productsCollection = db.collection('products');

    // Check products
    const products = await productsCollection.find({}).limit(2).toArray();
    console.log('Sample product:', JSON.stringify(products[0], null, 2));

    console.log('\nChecking all collections...');
    
    // Try different collection names
    const collections = await db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    // Check fs.files with images prefix
    const files1 = await db.collection('images.files').find({}).toArray();
    console.log('\nimages.files count:', files1.length);

    // Check fs.files
    const files2 = await db.collection('fs.files').find({}).toArray();
    console.log('fs.files count:', files2.length);

    // Check the product's image_gridfs_id
    const product = products[0];
    if (product.image_gridfs_id) {
      const gridfsId = product.image_gridfs_id;
      console.log('\nTrying to find file with id:', gridfsId);
      
      try {
        const oid = new ObjectId(gridfsId);
        
        // Try in images.files
        const imgFile = await db.collection('images.files').findOne({ _id: oid });
        console.log('Found in images.files:', !!imgFile);
        if (imgFile) console.log('File:', JSON.stringify(imgFile, null, 2));
        
        // Try in fs.files
        const fsFile = await db.collection('fs.files').findOne({ _id: oid });
        console.log('Found in fs.files:', !!fsFile);
        if (fsFile) console.log('File:', JSON.stringify(fsFile, null, 2));
      } catch (e) {
        console.log('Error creating ObjectId:', e.message);
      }
    }

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugImages();
