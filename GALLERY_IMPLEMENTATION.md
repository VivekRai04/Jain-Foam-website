# Gallery Image Management System - Implementation Guide

## Overview
Your project has been upgraded to use a database-driven gallery image system. Images are now stored on disk while metadata is managed in SQLite, replacing the hardcoded static images.

## Architecture

### Database (SQLite)
- **Location**: `data/app.db` (auto-created)
- **Table**: `gallery_items`
  - `id` (TEXT PRIMARY KEY): Unique identifier for each gallery item
  - `title` (TEXT): Display title of the image
  - `category` (TEXT): Category (Mattresses, Curtains, Sofas, Wallpapers, Flooring, Carpets, Blinds, Artificial Grass)
  - `image_filename` (TEXT): Filename stored on disk
  - `image_path` (TEXT): Relative path to the image (e.g., `/uploads/gallery/filename`)
  - `order_index` (INTEGER): Display order in gallery
  - `created_at` (TEXT): Creation timestamp
  - `updated_at` (TEXT): Last update timestamp

### File Storage
- **Location**: `uploads/gallery/` (auto-created)
- Images are stored with their original filenames
- Supported formats: JPEG, PNG, WebP, GIF
- Max file size: 10MB

## API Endpoints

### Public Endpoints

#### Get All Gallery Items
```
GET /api/gallery
Response: Array of GalleryItem objects
```

#### Get Single Gallery Item
```
GET /api/gallery/:id
Response: Single GalleryItem object
```

### Admin Endpoints (Requires Authentication)

#### Upload Image
```
POST /api/admin/gallery/upload
Content-Type: multipart/form-data

Fields:
- image: File (required)
- title: string (required)
- category: string (required, must be one of the predefined categories)

Response: { success: true, item: GalleryItem }
```

#### Update Gallery Item
```
PUT /api/admin/gallery/:id
Content-Type: application/json

Body: {
  title?: string,
  category?: string,
  order_index?: number
}

Response: { success: true, item: GalleryItem }
```

#### Delete Gallery Item
```
DELETE /api/admin/gallery/:id

Response: { success: true }
Note: This deletes both the database record and the physical file
```

## Frontend Changes

### Gallery Component
- **File**: `client/src/pages/Gallery.tsx`
- Now fetches images from `/api/gallery` using React Query
- Images are no longer hardcoded imports
- Automatically filters by category
- Lazy loads images for better performance

### Admin Gallery Management
- **File**: `client/src/pages/AdminGallery.tsx`
- New admin interface for managing gallery images
- Upload multiple images with title and category
- View all uploaded images
- Delete images with confirmation dialog
- Real-time UI updates using React Query

### Routing
- **File**: `client/src/App.tsx`
- New route added: `/admin/gallery`
- Accessible from Admin Dashboard

### Admin Dashboard
- **File**: `client/src/pages/AdminDashboard.tsx`
- "Manage Gallery" card now navigates to `/admin/gallery`
- Replaces the placeholder alert

## Server Changes

### New Files
1. **`server/database.ts`**
   - SQLite database initialization and connection
   - Helper functions for database queries
   - Initial seed data loading (existing images)

2. **`server/routes.ts`** (Updated)
   - Gallery API endpoints
   - Multer configuration for file uploads
   - Image validation and storage

3. **`server/storage.ts`** (Updated)
   - Gallery item management methods
   - Database integration with existing storage

### Server Configuration
- **`server/index.ts`** (Updated)
  - Static file serving for uploaded images at `/uploads`
  - Image files are accessible via `/uploads/gallery/<filename>`

## Initial Data

On first startup, the database is automatically seeded with the existing images from your project:
- Hero Living Room (Sofas)
- Premium Memory Foam Mattress (Mattresses)
- Elegant Designer Curtains (Curtains)
- Modern Comfort Sofa (Sofas)
- 3D Geometric Wallpaper (Wallpapers)
- PVC Wood Texture Flooring (Carpets)

## Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```
   The database will be created automatically on first run.

2. **Access the Gallery**
   - Public: `http://localhost:5000/gallery`
   - Admin: `http://localhost:5000/admin/gallery` (login required)

3. **Upload New Images**
   - Navigate to Admin Dashboard
   - Click "Manage Gallery"
   - Upload images with title and category
   - Images appear immediately in the gallery

4. **Delete Images**
   - Click delete button on any image card
   - Confirm deletion
   - Image is removed from both database and disk

## File Structure
```
project/
├── data/
│   └── app.db                 # SQLite database (auto-created)
├── uploads/
│   └── gallery/               # Uploaded gallery images
├── server/
│   ├── database.ts            # Database setup and helpers
│   ├── routes.ts              # API endpoints
│   ├── storage.ts             # Storage layer with gallery methods
│   └── index.ts               # Server configuration
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Gallery.tsx     # Public gallery page
│       │   ├── AdminGallery.tsx # Admin management interface
│       │   ├── AdminDashboard.tsx
│       │   └── ...
│       └── App.tsx             # Routing
```

## Key Features

✅ **Database-Driven**: All gallery data stored in SQLite  
✅ **File Management**: Images stored on disk with organized structure  
✅ **Admin Interface**: Easy upload and delete functionality  
✅ **Real-time Updates**: React Query handles data synchronization  
✅ **Type-Safe**: Full TypeScript support throughout  
✅ **Validation**: Image type and size validation on upload  
✅ **Responsive**: Works on all devices  
✅ **Authentication**: Admin functions require login  

## Dependencies Added
- `sqlite3`: SQLite database driver
- `multer`: Multipart form data handling for file uploads
- `@types/multer`: TypeScript types for multer

## Troubleshooting

### Database doesn't exist
- Database is created automatically on first run
- Check that `data/` directory exists with proper permissions

### Images not showing
- Ensure uploads directory was created: `uploads/gallery/`
- Check file paths are correct in database
- Verify server is running and static files are being served

### Upload fails
- Check file size is under 10MB
- Verify file format is supported (JPEG, PNG, WebP, GIF)
- Ensure permissions allow writing to `uploads/` directory

### Admin access denied
- Verify you're logged in correctly
- Session may have expired, log in again
- Check that admin authentication is working

## Next Steps (Optional)

1. **Image Optimization**: Consider adding image resizing/compression
2. **Thumbnails**: Generate thumbnails for admin interface
3. **Bulk Upload**: Add drag-and-drop or multiple file upload
4. **Image Editing**: Add title/category editing in admin UI
5. **Search/Sort**: Add search and sorting to gallery items

---

For questions or issues, refer to the individual file documentation.
