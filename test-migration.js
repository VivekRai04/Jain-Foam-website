
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'data', 'app.db');
const enquiriesPath = join(__dirname, 'enquiries.json');

// Test 1: Check if database exists and contact_inquiries table exists
console.log('=== Testing Migration ===\n');
console.log('1. Checking SQLite database...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    process.exit(1);
  }
  console.log('✅ Database connected');
  
  // Check if table exists
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Error checking tables:', err);
      process.exit(1);
    }
    
    const tableNames = tables.map(t => t.name);
    console.log('✅ Tables in database:', tableNames.join(', '));
    
    if (tableNames.includes('contact_inquiries')) {
      console.log('✅ contact_inquiries table exists');
      
      // Check if there are records
      db.get("SELECT COUNT(*) as count FROM contact_inquiries", (err, result) => {
        if (err) {
          console.error('❌ Error counting inquiries:', err);
          process.exit(1);
        }
        
        console.log(`✅ Found ${result.count} inquiries in database`);
        
        // Test 2: Check JSON file content
        console.log('\n2. Checking JSON file...');
        const enquiriesData = readFileSync(enquiriesPath, 'utf-8');
        const enquiries = JSON.parse(enquiriesData);
        console.log(`✅ JSON file contains ${enquiries.length} inquiries`);
        
        if (result.count === enquiries.length) {
          console.log('✅ Migration completed: All inquiries migrated successfully');
        } else {
          console.log(`⚠️  Warning: Database has ${result.count} records but JSON file has ${enquiries.length} records`);
        }
        
        // Test 3: Verify data matches
        if (result.count > 0) {
          console.log('\n3. Verifying data matches...');
          db.get("SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 1", (err, latestDb) => {
            if (err) {
              console.error('❌ Error getting latest inquiry:', err);
              process.exit(1);
            }
            
            const latestJson = enquiries[enquiries.length - 1];
            
            if (latestDb && latestJson) {
              if (latestDb.email === latestJson.email) {
                console.log('✅ Latest inquiry matches (email):', latestDb.email);
              } else {
                console.log('⚠️  Latest emails do not match');
              }
            }
            
            db.close();
            console.log('\n=== Migration Test Complete ===');
          });
        } else {
          db.close();
          console.log('\n=== Migration Test Complete ===');
        }
      });
    } else {
      console.error('❌ contact_inquiries table not found');
      process.exit(1);
    }
  });
});
