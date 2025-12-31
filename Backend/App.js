import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Item from "./models/Menu.js";
import path from "path";
import Order from "./models/Order.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port & Mongo URI
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODBURI;

const _dirname = path.resolve();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Mongo URI:", URI); // Debug
    await mongoose.connect(URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// Root route
// app.get("/", (req, res) => {
//   res.send("API is Running");
// });

// GET all menus
app.get("/api/menu", async (req, res) => {
  try {
    const menus = await Item.find();
    console.log("📦 All menus requested");
    res.status(200).json(menus);
  } catch (error) {
    console.error("❌ Error fetching menus:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single product by custom numeric ID
app.get("/api/menus/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const item = await Item.findOne({ id: productId });

    console.log(`🔍 Product requested with ID: ${req.params.id}`);

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Hostory
app.get("/api/hist", async (req, res) => {
  try {
    const hists = await Order.find();
    console.log("📦 All hists requested");
    res.status(200).json(hists);
  } catch (error) {
    console.error("❌ Error fetching hists:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single product by custom numeric ID
app.get("/api/hists/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const order = await Order.findOne({ id: productId });

    console.log(`🔍 Product requested with ID: ${req.params.id}`);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new order
app.post("/api/orders", async (req, res) => {
  try {
    const { orderId, items, subtotal, tax, deliveryFee, grandTotal, date } =
      req.body;

    // Transform data to match Schema
    const newOrder = new Order({
      id: orderId, // using orderId as the unique id
      orderId,
      date: new Date(),
      items: items.reduce((acc, item) => acc + item.quantity, 0),
      itemNames: items.map((item) => item.name),
      itemPrices: items.map((item) => item.price),
      itemQuantities: items.map((item) => item.quantity),
      totalAmount: parseFloat(grandTotal),
      status: "pending",
      paymentMethod: "Credit Card", // Defaulting for now as per UI
    });

    const savedOrder = await newOrder.save();
    console.log("✅ New order saved:", savedOrder.orderId);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error saving order:", error.message);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// DELETE all orders
app.delete("/api/hist", async (req, res) => {
  try {
    await Order.deleteMany({});
    console.log("🗑️ All orders deleted");
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting orders:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve frontend static files
app.use(express.static(path.join(_dirname, "/my-project/dist")));

// Catch-all route to serve index.html (SPA support)
// Use regex to avoid "Missing parameter name" error with newer path-to-regexp versions
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "my-project", "dist", "index.html"))
});
// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 App is listening on http://localhost:${PORT}`);
});
