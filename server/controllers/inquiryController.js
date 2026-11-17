import Inquiry from '../models/Inquiry.js';

export async function createInquiry(req, res) {
  try {
    const { name, phone, email, branchId, catalogItemId, partDetails, oemNumber } = req.body;
    const inquiry = await Inquiry.create({
      customer: { name, phone, email },
      branch: branchId || null,
      catalogItem: catalogItemId || null,
      partDetails,
      oemNumber,
    });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function getInquiries(req, res) {
  const list = await Inquiry.find()
    .populate('branch', 'name phone')
    .populate('catalogItem', 'name oemNumbers')
    .sort({ createdAt: -1 });
  res.json(list);
}
