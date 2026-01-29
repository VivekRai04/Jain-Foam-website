# Database-Driven Gallery - Quick Reference

## What Changed

Your gallery has been converted from **hardcoded static images** to a **database-driven system** where:
- Images are stored on disk (`uploads/gallery/`)
- Metadata is stored in SQLite (`data/app.db`)
- New admin interface to upload/delete images without code changes

## Key Files Modified/Created

### Server-Side
| File | Type | Purpose |
|------|------|---------|
| `server/database.ts` | ✨ NEW | SQLite database setup & helpers |
| `server/routes.ts` | 🔄 UPDATED | Gallery API endpoints + multer upload config |
| `server/storage.ts` | 🔄 UPDATED | Gallery item management methods |
| `server/index.ts` | 🔄 UPDATED | Static file serving for uploads |

### Client-Side
| File | Type | Purpose |
|------|------|---------|
| `client/src/pages/Gallery.tsx` | 🔄 UPDATED | Fetch images from API instead of imports |
| `client/src/pages/AdminGallery.tsx` | ✨ NEW | Admin interface for image management |
| `client/src/pages/AdminDashboard.tsx` | 🔄 UPDATED | Link to gallery management |
| `client/src/App.tsx` | 🔄 UPDATED | Added `/admin/gallery` route |

### Documentation
- `GALLERY_IMPLEMENTATION.md` - Complete implementation guide

## Database Schema

```sql
CREATE TABLE gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_filename TEXT NOT NULL,
  image_path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

## How It Works

### User Flow
1. **Upload Image** (Admin)
   - Navigate to `/admin/gallery`
   - Fill in title and select category
   - Upload image file
   - Image saved to `uploads/gallery/`
   - Metadata saved to SQLite

2. **View Gallery** (Public)
   - Visit `/gallery`
   - Images fetched from API (`/api/gallery`)
   - Gallery rendered with database data

3. **Delete Image** (Admin)
   - Click delete button on image card
   - Confirm deletion
   - File deleted from disk, record removed from database

## API Quick Reference

```bash
# Get all gallery items
GET /api/gallery

# Get single item
GET /api/gallery/:id

# Upload image (admin only)
POST /api/admin/gallery/upload
Content-Type: multipart/form-data
Fields: image, title, category

# Update item (admin only)
PUT /api/admin/gallery/:id
Body: { title?, category?, order_index? }

# Delete item (admin only)
DELETE /api/admin/gallery/:id
```

## Running the Project

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Type check
npm run check

# Build for production
npm run build
```

## Initial Data

The system comes pre-populated with your existing images:
- Hero Living Room (Sofas)
- Premium Memory Foam Mattress (Mattresses)
- Elegant Designer Curtains (Curtains)
- Modern Comfort Sofa (Sofas)
- 3D Geometric Wallpaper (Wallpapers)
- PVC Wood Texture Flooring (Carpets)

These are served from the `client/public/generated_images/` folder.

## Categories Available

- Mattresses
- Curtains
- Sofas
- Wallpapers
- Flooring
- Carpets
- Blinds
- Artificial Grass

## File Constraints

- **Max size**: 10MB per image
- **Allowed formats**: JPEG, PNG, WebP, GIF
- **Storage location**: `uploads/gallery/` (auto-created)

## Directory Structure

```
project/
├── data/
│   └── app.db                 # SQLite database
├── uploads/
│   └── gallery/               # Uploaded images
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Gallery.tsx    # Updated to use API
│   │   │   └── AdminGallery.tsx # New admin interface
│   │   └── App.tsx            # Updated routing
│   └── public/
│       └── generated_images/  # Initial seed images
└── server/
    ├── database.ts            # New: DB helpers
    ├── routes.ts              # Updated: API endpoints
    ├── storage.ts             # Updated: Gallery methods
    └── index.ts               # Updated: Static serving
```

## Common Tasks

### Add a new image
1. Go to `/admin/gallery` (login required)
2. Fill title and category
3. Select image file
4. Click "Upload Image"

### Remove an image
1. Go to `/admin/gallery`
2. Find image in grid
3. Click "Delete"
4. Confirm deletion

### Move image to production
```bash
npm run build
NODE_ENV=production node dist/index.js
```

The database and uploads folder will be created automatically.

## Environment Variables

Optional but recommended:
- `ADMIN_PASSWORD`: Admin login password (hashed)
- `SESSION_SECRET`: Session encryption secret
- `PORT`: Server port (default: 5000)

---

**Status**: ✅ Ready to use - images now load from database instead of static imports
