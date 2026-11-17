import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import CatalogItem from '../models/CatalogItem.js';

// Returns featured brand cards for the homepage.
export async function getFeaturedBrands(req, res) {
  try {
    const brands = await Brand.find({ 'featuredCard.isFeatured': true }).sort({
      'featuredCard.order': 1,
    });
    const formatted = brands.map((b) => ({
      id: b.slug,
      brand: b.code,
      image: b.featuredCard.image,
      imageAlt: b.featuredCard.imageAlt,
      logo: b.logoUrl,
      tagline: b.featuredCard.tagline,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Returns filterable catalog items with populated Brand, Category & Branch refs
export async function getCatalogItems(req, res) {
  try {
    const { brand, category, search } = req.query;
    const query = {};

    if (brand && brand !== 'All Brands') query.brandCode = brand.toUpperCase();
    if (category && category !== 'all') query.categorySlug = category.toLowerCase();
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { oemNumbers: regex },
        { compatibility: regex },
        { description: regex },
      ];
    }

    const items = await CatalogItem.find(query)
      .populate('brand', 'name code logoUrl')
      .populate('category', 'slug label')
      .populate('stock.availableBranches', 'name phone');

    // Preserve flat fields expected by existing frontend components
    const formatted = items.map((item) => ({
      _id: item._id,
      id: item.slug,
      name: item.name,
      brand: item.brandCode,
      brandDetails: item.brand,
      category: item.categorySlug,
      categoryDetails: item.category,
      oemNumber: item.oemNumbers.join(' / '),
      oemNumbers: item.oemNumbers,
      compatibility: item.compatibility,
      availability: item.stock.statusLabel,
      stock: item.stock,
      image: item.image,
      description: item.description,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCatalogFilters(req, res) {
  try {
    const [categories, brands] = await Promise.all([
      Category.find().sort({ order: 1 }),
      Brand.find({ showInCatalog: { $ne: false } }).sort({ name: 1 }),
    ]);
    res.json({
      categories: [{ id: 'all', label: 'All Categories' }, ...categories.map((c) => ({ id: c.slug, label: c.label }))],
      brands: ['All Brands', ...brands.map((b) => b.code)],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
