# Jain Foam & Furnishing Website

A modern, full-stack e-commerce website for Jain Foam & Furnishing, showcasing their 30+ years of expertise in foam products, sofas, curtains, wallpapers, and home furnishings. Built with a focus on trust, local business credibility, and seamless user experience.

## Features

- **Responsive Design**: Mobile-first approach with clean, airy aesthetics inspired by modern e-commerce platforms.
- **Product Showcase**: High-quality product galleries with categories like Curtains, Sofas, Wallpapers, Flooring, and Mattresses.
- **Interactive Gallery**: Filterable masonry grid with lightbox viewing for customer installations and product variety.
- **Contact Integration**: Comprehensive contact form with business information, map integration, and email functionality.
- **SEO Optimized**: Schema markup, location prominence, and performance-focused design for local search visibility.
- **Admin Features**: Backend routes for managing products, orders, and customer inquiries.
- **AI-Powered Chatbot**: Integrated chatbot for customer assistance.
- **Dark/Light Mode**: Theme switching with smooth transitions.

## Tech Stack

### Frontend
- **React 18** with **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible UI primitives
- **Framer Motion** for smooth animations
- **React Query** for data fetching and caching
- **Wouter** for lightweight routing

### Backend
- **Express.js** with **TypeScript**
- **Drizzle ORM** with **Neon Database** for data management
- **Passport.js** for authentication
- **Nodemailer** for email services
- **WebSocket** support for real-time features

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for fast bundling
- **Drizzle Kit** for database migrations
- **PostCSS** with Autoprefixer

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/jain-foam-website.git
   cd jain-foam-website

Install dependencies:

npm install
Set up environment variables:

Copy .env and configure your database, email, and API keys
Refer to EMAIL_SETUP.md for email configuration
Set up the database:

npm run db:push
Start development server:

npm run dev
The application will be available at http://localhost:5173 (client) and server on configured port.

Usage
Development: npm run dev - Starts both client and server in development mode
Build: npm run build - Builds the application for production
Start: npm run start - Runs the production build
Type Check: npm run check - Runs TypeScript type checking
Database Push: npm run db:push - Applies database schema changes
Project Structure
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── email.ts          # Email service
│   └── storage.ts        # File storage utilities
├── shared/                # Shared types and schemas
├── attached_assets/       # Generated images and resources
└── design_guidelines.md   # Design system documentation
Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
Jain Foam & Furnishing

Website: [Your deployed site URL]
Email: [Business email]
Phone: [Business phone]
Address: [Business address]
For technical inquiries or contributions, please open an issue on GitHub.
