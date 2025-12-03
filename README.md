# 🛍️ Jain Foam & Furnishing Website

A modern, full-stack e-commerce website for **Jain Foam & Furnishing**, showcasing their **30+ years of expertise** in foam products, sofas, curtains, wallpapers, and home furnishings. The platform is designed to emphasize trust, local credibility, and a seamless shopping experience.

---

## ✨ Features

- **Responsive UI** with a clean, modern aesthetic
- **Product Showcase** with categories such as **Curtains, Sofas, Wallpapers, Flooring, and Mattresses**
- **Interactive Image Gallery** featuring filterable masonry grid and lightbox
- **Contact & Inquiry Integration** with forms, location map, and email support
- **Search Engine Optimized** for strong local presence
- **AI-Powered Chatbot** for customer support

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
- Brevo API
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
- Reference `EMAIL_SETUP.md` for email setup.

### 4. Start Development Server
```bash
npm run dev
```
- Client: `http://localhost:5173`
- Server: runs on configured backend port

---

## 💻 Usage

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server in development |
| `npm run build` | Build production bundle |
| `npm run start` | Run production server |
| `npm run check` | TypeScript type checking |

---

## 📁 Project Structure

```
├── client/                  # Frontend (React)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Config & utilities
├── server/                  # Backend (Express)
│   ├── index.ts            # API entry point
│   ├── routes.ts           # API routes
│   ├── email.ts            # Email service
│   └── storage.ts          # File management utilities
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
- Email: *raiv5253@gmail.com*
- Phone: *8850472926*

For technical support or contributions, please open an issue on GitHub.
