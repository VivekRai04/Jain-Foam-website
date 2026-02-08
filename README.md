# Jain Foam Website

A modern, full-stack website for Jain Foam featuring product showcases, galleries, contact management, and an admin dashboard.

## 🎯 Features

- **Product & Services Showcase** - Display foam products and services with categories and images
- **Image Gallery** - Admin-managed gallery for showcasing work and projects
- **Contact Form** - Customer inquiry management with email notifications
- **Admin Dashboard** - Secure admin interface for managing:
  - Gallery uploads and management
  - Product/service management
  - Customer enquiries and responses
- **Responsive Design** - Mobile-first UI built with TailwindCSS
- **Real-time Updates** - Powered by React Query for state management
- **Email Notifications** - Integrated Brevo API for inquiry notifications

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool & dev server)
- TailwindCSS (styling)
- React Query (state management)
- Wouter (lightweight routing)
- shadcn/ui (component library)
- Lucide React (icons)

**Backend:**
- Node.js / Express
- SQLite (database)
- Brevo API (email service)
- Express Session (authentication)
- Multer (file uploads)

## 📦 Project Structure

```
jain-foam-website/
├── client/                 # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html         # Entry point
├── server/                # Backend (Node/Express)
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API routes
│   ├── database.ts       # SQLite initialization
│   ├── email.ts          # Brevo email service
│   └── storage.ts        # Product/service data
├── attached_assets/       # Static assets (images)
├── uploads/               # User-uploaded files
└── package.json          # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Windows PowerShell (for development on Windows)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jain-foam-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   BREVO_API_KEY=your_brevo_api_key
   CONTACT_EMAIL=your_contact_email@example.com
   SESSION_SECRET=your_random_secret_key_here
   ADMIN_PASSWORD=your_admin_password
   ```

   **Environment Variables Explained:**
   - `PORT` - Server port (default: 5000)
   - `NODE_ENV` - development or production (enables Vite HMR in dev)
   - `BREVO_API_KEY` - API key from Brevo for sending emails
   - `CONTACT_EMAIL` - Email address that receives contact form submissions
   - `SESSION_SECRET` - Secret key for encrypting session cookies (use a strong random string)
   - `ADMIN_PASSWORD` - Password for admin login (stored securely with bcrypt)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5000`

### Build for Production

```bash
npm run build
```

This builds both the frontend and backend for deployment.

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Check TypeScript types

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin` with the credentials set in your `.env` file.

**Admin Features:**
- **Gallery Management** - Upload, view, and manage gallery images
- **Product Management** - Edit product/service details
- **Enquiries** - View and manage customer inquiries

## 📁 File Storage

- **Static Assets** - Served from `attached_assets/` (product images, logos, etc.)
- **User Uploads** - Gallery uploads stored in `uploads/gallery/` with hashed filenames

## 🌐 Deployment

The project is configured for deployment on platforms like:
- Vercel (with server setup)
- Netlify (with serverless functions)
- Traditional Node.js hosting (VPS, DigitalOcean, Heroku, etc.)

### Environment Setup for Production
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use a production-grade database (consider migrating from SQLite)
4. Ensure HTTPS is enabled
5. Configure proper CORS if needed

## 📧 Email Service

This project uses **Brevo** (formerly Sendinblue) for sending email notifications. To set up:

1. Create a Brevo account at https://www.brevo.com
2. Get your API key from the dashboard
3. Add it to your `.env` as `BREVO_API_KEY`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues or questions, please contact the project maintainers.

Vivek Rai 

raiv5253@gmail.com

---

Built with ❤️ by the Vivek Rai
"# Deployment fix"  
"# Jain-Foam-Furnishing" 
