
import { connectToMongoDB, disconnectFromMongoDB, Product, GalleryItem, ContactInquiry, Category } from './server/mongodb';

async function testMongoDBConnection() {
  console.log('=== Testing MongoDB Connection ===');
  
  try {
    const connected = await connectToMongoDB();
    if (!connected) {
      console.error('❌ Failed to connect to MongoDB');
      return;
    }
    
    console.log('✅ MongoDB connection established successfully');
    
    // Test inserting a document
    console.log('\n=== Testing Document Insertion ===');
    
    // Test Product insertion
    const testProductId = `test-${Date.now()}`;
    const testProduct = new Product({
      id: testProductId,
      name: 'Test Product',
      category: 'Test Category',
      description: 'This is a test product',
      image_filename: 'test-image.jpg',
      image_path: '/images/test-image.jpg',
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    await testProduct.save();
    console.log('✅ Test product saved');
    
    // Test querying
    const foundProduct = await Product.findOne({ id: testProductId });
    if (foundProduct) {
      console.log('✅ Test product found');
    }

    // Cleanup
    await Product.deleteOne({ id: testProductId });
    console.log('✅ Test product deleted');
    
    // Test MongoDB collections
    const productCount = await Product.countDocuments();
    const galleryCount = await GalleryItem.countDocuments();
    const inquiryCount = await ContactInquiry.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log('\n=== Collection Statistics ===');
    console.log(`Products: ${productCount}`);
    console.log(`Gallery Items: ${galleryCount}`);
    console.log(`Inquiries: ${inquiryCount}`);
    console.log(`Categories: ${categoryCount}`);
    
    await disconnectFromMongoDB();
    console.log('\n✅ MongoDB connection test completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
  }
}

testMongoDBConnection();
