# Stylink Truck Parts - React Application

A modern, component-based React application for **Stylink Truck Parts (Private) Limited** — wholesale and retail supplier of heavy-duty truck and commercial auto parts in Zimbabwe.

Built with **React 18**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

- **Component-Driven Architecture**: Modular, maintainable, and decoupled UI components.
- **Centralized Data Layer**: Content (navigation, brands, products, testimonials, branches, values) cleanly separated into `src/data/`.
- **Interactive Hero Carousel**: Horizontal slide slider with auto-rotation, dot indicators, and controls.
- **Infinite Logo Marquee**: Smooth, endless brand reel with pause-on-hover effect.
- **Responsive Mobile Navigation**: Clean sticky navigation bar with a responsive drawer menu.
- **Dynamic Footer & WhatsApp Widget**: Live copyright year, multi-branch addresses with direct calling, and a floating WhatsApp customer support widget.

---

## 📁 Project Structure

```text
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Header.jsx           # Sticky nav & mobile navigation drawer
    │   ├── Hero.jsx             # Auto-advancing full-screen horizontal hero slider
    │   ├── BrandsMarquee.jsx    # Infinite scrolling truck brand logos
    │   ├── About.jsx            # 60/40 Corporate overview & core values
    │   ├── ProductCard.jsx      # Reusable brand product card
    │   ├── Products.jsx         # Product catalog showcase grid
    │   ├── WhyUs.jsx            # Value proposition and key advantages
    │   ├── CtaBanner.jsx        # Stylized partner message section
    │   ├── Testimonials.jsx     # Customer proof & reviews with 5-star ratings
    │   ├── Footer.jsx           # Multi-branch directory, social links & legal
    │   └── WhatsAppButton.jsx   # Floating responsive WhatsApp CTA
    └── data/
        ├── navigation.js        # Nav links, logo, and core contacts
        ├── slides.js            # Hero carousel slide content & images
        ├── brands.js            # Partner & OEM brand logos
        ├── company.js           # Mission, vision, and core company values
        ├── products.js          # Featured truck brand categories
        ├── features.js          # "Why Choose Us" cards
        ├── testimonials.js      # Customer reviews and quotes
        ├── branches.js          # Harare HQ, CBD, and Bulawayo locations
        └── socials.js           # Social media profiles
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or the port specified by Vite in your terminal).

### 3. Build for Production
```bash
npm run build
```

The optimized static assets will be output to the `dist/` folder.

### 4. Preview the Production Build
```bash
npm run preview
```

## Admin product portal

Open `/#/admin` to sign in and manage all database data. On first login, the configured `ADMIN_PASSWORD` environment variable is migrated into the database as a salted scrypt hash; after this initial setup, authentication uses the database credential and `ADMIN_PASSWORD` can be removed. Use the admin page's **Change admin password** form to update it; new passwords must be at least 12 characters. Password changes invalidate other active admin sessions. If `ADMIN_SESSION_SECRET` is omitted, the backend generates a temporary random secret for that process. Sessions signed with an auto-generated secret become invalid when the backend restarts, so configure a stable private secret for production. Admin sessions use an expiring, HttpOnly cookie, and admin changes require a same-origin request.

The admin portal's **Manage all database data** section can create, edit, and permanently delete records in every application collection: products, brands, categories, branches, slides, hero sections, features, testimonials, company settings, and customer inquiries. Hero section records control the headings, highlighted text, descriptions, breadcrumb labels, background images, and optional calls to action on the home, about, catalog, and outlets pages. Every schema field is available through a form, including nested fields and repeatable lists; an advanced JSON mode is also available. When creating records in advanced mode, submit one object or an array of up to 50 records for bulk insertion. MongoDB Extended JSON `$oid` references and JSON-encoded array fields are normalized for imports. Select multiple records on a page for bulk deletion, or use the delete button on an individual record. Records are validated against their Mongoose schema, while IDs and timestamps are managed by the server. Deleting a record may affect other records that reference it.

To add the default hero-section records to an existing database without replacing other data or overwriting existing hero edits, run `npm run seed:hero-sections`. The regular full database seed also includes these defaults, but clears and recreates the other seeded collections.

## Deploy on Vercel

Import this repository in Vercel with the repository root as the project root. The included `vercel.json` configures the Vite build and SPA routing, and `api/[...path].js` serves the Express API as a Vercel Function.

Before deploying, add `MONGODB_URI` in the Vercel project's Environment Variables for the environments you use. Rotate any MongoDB credentials that have been committed to Git history; do not reuse them or commit `.env` files.

# stylink-website
