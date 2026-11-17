import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";
import Inquiry from "./models/Inquiry.js";

// Ensures server/.env loads reliably regardless of which folder you run node from
dotenv.config({ path: new URL("./.env", import.meta.url) });

await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "connected" });
});

// Get all products (supports ?brand=Scania)
app.get("/api/products", async (req, res) => {
  try {
    const filter = req.query.brand ? { brand: req.query.brand } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Invalid product data", error: err.message });
  }
});

// Submit a quote / parts inquiry
app.post("/api/inquiries", async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`),
);
