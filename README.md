# 🛍️ Jain Foam & Furnishing Website

A modern, full-stack e-commerce website for **Jain Foam & Furnishing**, showcasing their **30+ years of expertise** in foam products, sofas, curtains, wallpapers, and home furnishings. The platform is designed to emphasize trust, local credibility, and a seamless shopping experience.

---

## ✨ Features

- **Responsive UI** with a clean, modern aesthetic
- **Product Showcase** with categories such as **Curtains, Sofas, Wallpapers, Flooring, and Mattresses**
- **Database-Driven Image Gallery** with dynamic image management from SQLite database
- **Interactive Image Gallery** featuring filterable masonry grid and lightbox
- **Contact & Inquiry Integration** with forms, location map, and email support
- **Admin Dashboard** for managing customer enquiries and gallery images
- **Search Engine Optimized** for strong local presence
- **AI-Powered Chatbot** for customer support

---

## 👨‍💼 Admin Dashboard

The application includes a comprehensive admin dashboard for managing customer enquiries and gallery images:

### Enquiry Management
- **Secure Authentication**: Password-protected admin access with bcrypt hashing
- **Enquiry Management**: View, update status, and delete customer enquiries
- **Persistent Storage**: All enquiries stored with status tracking
- **Real-time Updates**: Dashboard refreshes automatically
- **Status Tracking**: Mark enquiries as unread, read, or responded
- **Detailed View**: Expandable enquiry details with full customer information

### Gallery Management
- **Image Upload**: Upload images with title and category metadata
- **Database Storage**: All image data stored in SQLite database
- **File Management**: Images stored on disk with automatic organization
- **Admin Interface**: Clean grid view of all gallery items
- **Delete Operations**: Remove images with confirmation dialogs
- **Real-time Updates**: Gallery updates immediately after changes

### Access
- **Login URL**: `http://localhost:5000/admin/login`
- **Password**:  `(configurable in `.env`)`
- **Dashboard URL**: `http://localhost:5000/admin/dashboard`
- **Gallery Management**: `http://localhost:5000/admin/gallery`

### Configuration
Set the admin password hash in `.env`:

To generate a new password hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-new-password', 10).then(h => console.log(h))"
```

---

## 🛠️ Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- Radix UI
- React Query
- Wouter Router

### Backend
- Express.js (TypeScript)
- SQLite3 Database for image gallery and metadata
- File-based storage for enquiries with JSON persistence
- Session-based admin authentication with bcrypt
- Multer for image file upload handling
- RESTful API for enquiry and gallery management
- Brevo API for email notifications
- Noupe Chatbot Integration

### Developer Tooling
- TypeScript
- ESBuild
- PostCSS (Autoprefixer)

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/jain-foam-website.git
cd jain-foam-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
- Copy the provided `.env` template.
- Add email configuration, and API keys.

### 4. Start Development Server
```bash
npm run dev
```
- Client: `http://localhost:5000`
- Server: runs on configured backend port

---

## 💻 Usage

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server in development |
| `npm run build` | Build production bundle |
| `npm run start` | Run production server |
| `npm run check` | TypeScript type checking |

### Admin Access
- **Login URL:** `http://localhost:5000/admin/login`
- **Password:**  (configure in `.env`)
- **Dashboard:** `http://localhost:5000/admin/dashboard`

---

## 📁 Project Structure

```
├── client/                  # Frontend (React)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Page-level components
│   │   │   ├── AdminLogin.tsx      # Admin authentication
│   │   │   ├── AdminDashboard.tsx  # Dashboard navigation
│   │   │   ├── AdminEnquiries.tsx  # Enquiry management
│   │   │   ├── AdminGallery.tsx    # Gallery management
│   │   │   ├── Gallery.tsx         # Public gallery
│   │   │   └── ...                 # Other pages
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Config & utilities
├── server/                  # Backend (Express)
│   ├── index.ts            # API entry point
│   ├── database.ts         # SQLite database setup
│   ├── routes.ts           # API routes with admin endpoints
│   ├── email.ts            # Email service
│   └── storage.ts          # Storage utilities
├── data/                    # Runtime data
│   └── app.db              # SQLite database (auto-created)
├── uploads/                 # Uploaded files
│   └── gallery/            # Gallery images (auto-created)
├── enquiries.json          # Persistent enquiry storage
├── shared/                  # Shared schemas & types
├── attached_assets/         # Generated images & assets
└── design_guidelines.md     # Brand & UI design system
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/new-feature`)  
3. Commit changes (`git commit -m "Add new feature"`)  
4. Push the branch (`git push origin feature/new-feature`)  
5. Submit a Pull Request  

---

## 📞 Contact

**Jain Foam & Furnishing**

- Website: *https://jain-foam-website.onrender.com/*
- Email: *jainfoamf@gmail.com*
- Phone: *8097032550*

For technical support or contributions, please open an issue on GitHub.
