# Architecture Diagram - Database-Driven Gallery

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Public Gallery Page (/gallery)               │  │
│  │                                                       │  │
│  │  Gallery.tsx                                         │  │
│  │  └─ Fetches: GET /api/gallery                        │  │
│  │  └─ Displays images from database                    │  │
│  │  └─ Category filtering                               │  │
│  │  └─ Lazy loading images                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Admin Gallery Manager (/admin/gallery)           │  │
│  │                                                       │  │
│  │  AdminGallery.tsx (Requires Auth)                    │  │
│  │  ├─ POST /api/admin/gallery/upload                   │  │
│  │  ├─ PUT /api/admin/gallery/:id                       │  │
│  │  └─ DELETE /api/admin/gallery/:id                    │  │
│  │                                                       │  │
│  │  Features:                                           │  │
│  │  ├─ Upload images                                    │  │
│  │  ├─ View gallery items                               │  │
│  │  ├─ Delete images                                    │  │
│  │  └─ Real-time updates (React Query)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▼
                    (HTTP/REST API Calls)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER (Node.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Express Server (index.ts)                                  │
│  ├─ Static file serving: /uploads/*                         │
│  ├─ Session management                                      │
│  └─ Error handling                                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                API Routes (routes.ts)                 │  │
│  │                                                       │  │
│  │  Public Routes:                                      │  │
│  │  ├─ GET /api/gallery                                 │  │
│  │  └─ GET /api/gallery/:id                             │  │
│  │                                                       │  │
│  │  Admin Routes (require authentication):              │  │
│  │  ├─ POST /api/admin/gallery/upload  [multer]         │  │
│  │  ├─ PUT /api/admin/gallery/:id                       │  │
│  │  └─ DELETE /api/admin/gallery/:id                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                              ▼
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Storage Layer (storage.ts)                │  │
│  │                                                       │  │
│  │  GalleryItem Management:                             │  │
│  │  ├─ getGalleryItems()                                │  │
│  │  ├─ getGalleryItemById(id)                           │  │
│  │  ├─ createGalleryItem(item)                          │  │
│  │  ├─ updateGalleryItem(id, item)                      │  │
│  │  └─ deleteGalleryItem(id)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                  ▼                          ▼                │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │  SQLite Database     │      │   File System        │   │
│  │  (database.ts)       │      │   (File Storage)     │   │
│  │                      │      │                      │   │
│  │  data/app.db         │      │  uploads/gallery/    │   │
│  │  ┌────────────────┐  │      │  ├─ image1.webp     │   │
│  │  │gallery_items  │  │      │  ├─ image2.webp     │   │
│  │  │┌──────────────┤│  │      │  └─ image3.jpg      │   │
│  │  ││id            ││  │      │                      │   │
│  │  ││title         ││  │      │  Multer Upload:     │   │
│  │  ││category      ││  │      │  ├─ Validation      │   │
│  │  ││image_path    ││◄─┼──────┤  ├─ Size limit       │   │
│  │  ││image_filename││  │      │  └─ Type check      │   │
│  │  ││order_index   ││  │      │                      │   │
│  │  ││created_at    ││  │      │                      │   │
│  │  ││updated_at    ││  │      │                      │   │
│  │  │└──────────────┘│  │      │                      │   │
│  │  └────────────────┘  │      │                      │   │
│  └──────────────────────┘      └──────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### 1. Upload Image Flow (Admin)

```
┌─────────────┐
│   Admin     │
│  Selects    │
│   Image     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ AdminGallery Component       │
│ - Form with title/category   │
│ - File input                 │
└──────┬───────────────────────┘
       │
       ▼ FormData (multipart)
┌──────────────────────────────┐
│ POST /api/admin/gallery/upload
│ Headers: multipart/form-data │
│ Body: image, title, category │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ routes.ts (multer)           │
│ - Validate file type         │
│ - Check file size (< 10MB)   │
│ - Save to disk               │
└──────┬───────────────────────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌──────────────────┐      ┌─────────────────────────┐
│ uploads/gallery/ │      │   database.ts           │
│ └─ filename.jpg  │      │   CREATE RECORD         │
└──────────────────┘      │   - id (UUID)           │
                          │   - title               │
                          │   - category            │
                          │   - image_path          │
                          │   - timestamps          │
                          └────┬────────────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │   SQLite DB      │
                          │  data/app.db     │
                          │  (Insert Row)    │
                          └────┬─────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │ Response: 200 OK │
                          │ JSON: item data  │
                          └────┬─────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │ React Query      │
                          │ Invalidates      │
                          │ Gallery Cache    │
                          └──────────────────┘
```

### 2. View Gallery Flow (Public)

```
┌─────────────┐
│   User      │
│  Opens      │
│  /gallery   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ Gallery Component            │
│ useQuery(["gallery"])        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ GET /api/gallery             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ routes.ts (public endpoint)  │
│ storage.getGalleryItems()    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ database.ts                  │
│ SELECT * FROM gallery_items  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ SQLite DB (Query)            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return Array[GalleryItem]    │
│ [                            │
│   { id, title, image_path }, │
│   { id, title, image_path }, │
│   ...                        │
│ ]                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ React Query Cache            │
│ (stores data locally)        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Gallery Component            │
│ Renders grid of images       │
└──────┬───────────────────────┘
       │
       ├──────────────────────────┐
       │ For each image:          │
       │ <img src="/uploads/..."> │
       └──────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Static File Server           │
│ /uploads/gallery/* served    │
│ from uploads/ directory      │
└──────────────────────────────┘
```

### 3. Delete Image Flow (Admin)

```
┌─────────────────────┐
│  Admin clicks       │
│  Delete button      │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Confirmation Dialog          │
│ (Are you sure?)              │
└──────┬───────────────────────┘
       │ (Yes)
       ▼
┌──────────────────────────────┐
│ DELETE /api/admin/gallery/:id│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ routes.ts (admin endpoint)   │
│ - Get item record            │
│ - Delete from database       │
│ - Delete file from disk      │
└──────┬───────────────────────┘
       │
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌──────────────────┐    ┌──────────────────┐
│ SQLite DB        │    │ File System      │
│ DELETE WHERE id  │    │ fs.unlink()      │
│ = :id            │    │ uploads/gallery/ │
└──────┬───────────┘    └──────┬───────────┘
       │                       │
       └──────────────┬────────┘
                      │
                      ▼
              ┌──────────────────┐
              │ Response: 200 OK │
              └────┬─────────────┘
                   │
                   ▼
              ┌──────────────────┐
              │ React Query      │
              │ Invalidates      │
              │ Gallery Cache    │
              └────┬─────────────┘
                   │
                   ▼
              ┌──────────────────┐
              │ UI re-fetches    │
              │ from /api/gallery│
              └────┬─────────────┘
                   │
                   ▼
              ┌──────────────────┐
              │ Grid updated     │
              │ Image removed    │
              └──────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────┐
│          Frontend Stack              │
├─────────────────────────────────────┤
│                                     │
│  React 18                           │
│  ├─ Gallery.tsx (public)            │
│  └─ AdminGallery.tsx (admin)        │
│                                     │
│  React Query (@tanstack/react-query)
│  ├─ Data fetching                   │
│  ├─ Caching                         │
│  └─ Automatic invalidation          │
│                                     │
│  shadcn/ui Components               │
│  ├─ Card, Button, Input             │
│  ├─ Select, Dialog                  │
│  └─ AlertDialog                     │
│                                     │
│  TypeScript                         │
│  └─ Full type safety                │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          Backend Stack              │
├─────────────────────────────────────┤
│                                     │
│  Express.js (Node.js)               │
│  ├─ REST API endpoints              │
│  ├─ Session management              │
│  └─ Static file serving             │
│                                     │
│  SQLite3                            │
│  ├─ Persistent database             │
│  ├─ Gallery items storage           │
│  └─ Metadata management             │
│                                     │
│  Multer                             │
│  ├─ File upload handling            │
│  ├─ Validation                      │
│  └─ Size/type constraints           │
│                                     │
│  bcrypt                             │
│  └─ Password hashing (admin)        │
│                                     │
│  TypeScript                         │
│  └─ Full type safety                │
│                                     │
└─────────────────────────────────────┘
```

## Database Schema Visualization

```
┌──────────────────────────────────────────────────────────┐
│                    gallery_items                         │
├──────────────────────────────────────────────────────────┤
│ Column Name     │ Type    │ Constraints                  │
├─────────────────┼─────────┼──────────────────────────────┤
│ id              │ TEXT    │ PRIMARY KEY                  │
│ title           │ TEXT    │ NOT NULL                     │
│ category        │ TEXT    │ NOT NULL                     │
│ image_filename  │ TEXT    │ NOT NULL                     │
│ image_path      │ TEXT    │ NOT NULL                     │
│ order_index     │ INTEGER │ DEFAULT 0                    │
│ created_at      │ TEXT    │ NOT NULL (ISO timestamp)     │
│ updated_at      │ TEXT    │ NOT NULL (ISO timestamp)     │
└──────────────────────────────────────────────────────────┘

Sample Row:
┌──────────────────────────────────────────────────────────┐
│ id:        550e8400-e29b-41d4-a716-446655440000         │
│ title:     Premium Memory Foam Mattress                  │
│ category:  Mattresses                                   │
│ filename:  550e8400-e29b-41d4-a716-446655440000         │
│ path:      /uploads/gallery/550e8400-e29b-41d4-a716... │
│ order:     1                                             │
│ created:   2025-01-29T12:00:00.000Z                      │
│ updated:   2025-01-29T12:00:00.000Z                      │
└──────────────────────────────────────────────────────────┘
```

## File System Structure

```
project/
│
├── data/
│   └── app.db                  ← SQLite Database
│       └── Tables:
│           └── gallery_items (metadata)
│
├── uploads/
│   └── gallery/                ← Image Files
│       ├── 550e8400-e29b...   (image)
│       ├── 660f9501-f30c...   (image)
│       └── 770g0612-g41d...   (image)
│
├── server/
│   ├── database.ts             ← DB helpers
│   ├── routes.ts               ← API endpoints
│   ├── storage.ts              ← Storage layer
│   └── index.ts                ← Express setup
│
└── client/
    └── src/
        ├── pages/
        │   ├── Gallery.tsx      ← Public gallery
        │   ├── AdminGallery.tsx ← Admin interface
        │   └── ...
        └── App.tsx              ← Router
```

---

**Architecture**: Client-Server with Database
**Database**: SQLite (embedded)
**File Storage**: Disk (`uploads/gallery/`)
**API**: RESTful endpoints
**Authentication**: Session-based (admin only)
