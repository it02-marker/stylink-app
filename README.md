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

# stylink-website
