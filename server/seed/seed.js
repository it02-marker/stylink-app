import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Branch from '../models/Branch.js';
import CatalogItem from '../models/CatalogItem.js';
import Slide from '../models/Slide.js';
import HeroSection from '../models/HeroSection.js';
import Feature from '../models/Feature.js';
import Testimonial from '../models/Testimonial.js';
import Company from '../models/Company.js';

import { branchesData } from './data/branches.js';
import { brandLogos } from './data/brands.js';
import { productsData } from './data/products.js';
import {
  catalogCategories,
  catalogBrands,
  brandLogosMap,
  catalogItems,
} from './data/catalog.js';
import { heroSlides } from './data/slides.js';
import { heroSections } from './data/hero-sections.js';
import { featuresData } from './data/features.js';
import { testimonialsData } from './data/testimonials.js';
import { companyOverview } from './data/company.js';
import { navLinks, contactInfo } from './data/navigation.js';
import { socialLinks } from './data/socials.js';

dotenv.config({ path: './server/.env' });

const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas (stylink)...\n');

    // Clean existing collections
    await Promise.all([
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Branch.deleteMany({}),
      CatalogItem.deleteMany({}),
      Slide.deleteMany({}),
      HeroSection.deleteMany({}),
      Feature.deleteMany({}),
      Testimonial.deleteMany({}),
      Company.deleteMany({}),
    ]);

    // 1. Seed Branches
    const branchDocs = await Branch.insertMany(
      branchesData.map((b) => {
        const [street = '', cityLine = ''] = b.addressLines;
        const parts = cityLine.split(',').map((s) => s.trim());
        return {
          slug: toSlug(b.name),
          name: b.name,
          address: {
            street: street.replace(/,$/, ''),
            suburb: parts.length > 1 ? parts[0] : '',
            city: parts.length > 1 ? parts[1] : parts[0],
            lines: b.addressLines,
          },
          phone: b.phone,
          telLink: b.telLink,
        };
      })
    );
    const branchBySlug = Object.fromEntries(branchDocs.map((b) => [b.slug, b._id]));

    // 2. Seed Unified Brands (merging brands.js, products.js, and catalogBrands)
    const brandMap = new Map();
    const codeAliases = {
      'Mitsubishi Fuso': 'FUSO',
    };

    for (const b of brandLogos) {
      const code = (codeAliases[b.name] || b.name).toUpperCase();
      brandMap.set(code, {
        slug: toSlug(code),
        code,
        name: b.name,
        alt: b.alt,
        logoUrl: b.logoUrl,
        showInMarquee: true,
        showInCatalog: catalogBrands.includes(code),
        featuredCard: { isFeatured: false },
      });
    }

    for (const code of catalogBrands.filter((c) => c !== 'All Brands')) {
      if (!brandMap.has(code)) {
        brandMap.set(code, {
          slug: toSlug(code),
          code,
          name: code,
          alt: `${code} Parts`,
          logoUrl: brandLogosMap[code] || '',
          showInMarquee: false,
          showInCatalog: true,
          featuredCard: { isFeatured: false },
        });
      }
    }

    productsData.forEach((p, idx) => {
      const existing = brandMap.get(p.brand) || {
        slug: p.id,
        code: p.brand,
        name: p.brand,
        alt: p.imageAlt,
        logoUrl: p.logo,
        showInMarquee: false,
        showInCatalog: true,
      };
      existing.featuredCard = {
        isFeatured: true,
        order: idx + 1,
        image: p.image,
        imageAlt: p.imageAlt,
        tagline: p.tagline,
      };
      brandMap.set(p.brand, existing);
    });

    const brandDocs = await Brand.insertMany([...brandMap.values()]);
    const brandByCode = Object.fromEntries(brandDocs.map((b) => [b.code, b._id]));

    // 3. Seed Categories
    const categoryDocs = await Category.insertMany(
      catalogCategories
        .filter((c) => c.id !== 'all')
        .map((c, idx) => ({ slug: c.id, label: c.label, order: idx + 1 }))
    );
    const categoryBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c._id]));

    // 4. Seed Catalog Items with Real ObjectId References
    const resolveBranches = (label) => {
      const text = label.toLowerCase();
      if (text.includes('all branches')) return branchDocs.map((b) => b._id);
      const ids = [];
      if (text.includes('southerton') || text.includes('hq') || text.includes('harare')) {
        ids.push(branchBySlug['headquarters']);
      }
      if (text.includes('cbd')) ids.push(branchBySlug['cbd-branch']);
      if (text.includes('bulawayo')) ids.push(branchBySlug['bulawayo-branch']);
      return [...new Set(ids.filter(Boolean))];
    };

    const catalogDocs = await CatalogItem.insertMany(
      catalogItems.map((item) => ({
        slug: item.id,
        name: item.name,
        brand: brandByCode[item.brand],
        brandCode: item.brand,
        category: categoryBySlug[item.category],
        categorySlug: item.category,
        oemNumbers: item.oemNumber.split('/').map((n) => n.trim()).filter(Boolean),
        compatibility: item.compatibility,
        stock: {
          inStock: true,
          statusLabel: item.availability,
          availableBranches: resolveBranches(item.availability),
        },
        image: item.image,
        description: item.description,
      }))
    );

    // 5. Seed Slides, Features, Testimonials & Company Profile
    const [slides, heroSectionDocs, features, testimonials] = await Promise.all([
      Slide.insertMany(heroSlides.map((s) => ({
        order: s.id,
        name: s.name,
        imageUrl: s.imageUrl,
        alt: s.alt,
      }))),
      HeroSection.insertMany(heroSections),
      Feature.insertMany(featuresData.map((f, idx) => ({ order: idx + 1, ...f }))),
      Testimonial.insertMany(testimonialsData),
      Company.create({
        slug: 'stylink-zw',
        ...companyOverview,
        contact: contactInfo,
        navigation: navLinks.map((n, idx) => ({ ...n, order: idx + 1 })),
        socials: socialLinks,
      }),
    ]);

    console.log(`✓ branches:      ${branchDocs.length}`);
    console.log(`✓ brands:        ${brandDocs.length} (unified marquee, featured cards & catalog brands)`);
    console.log(`✓ categories:    ${categoryDocs.length}`);
    console.log(`✓ catalog_items: ${catalogDocs.length} (linked to Brand, Category & Branch ObjectIds)`);
    console.log(`✓ slides:        ${slides.length}`);
    console.log(`✓ hero sections: ${heroSectionDocs.length}`);
    console.log(`✓ features:      ${features.length}`);
    console.log(`✓ testimonials:  ${testimonials.length}`);
    console.log(`✓ company:       1 corporate profile document`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
