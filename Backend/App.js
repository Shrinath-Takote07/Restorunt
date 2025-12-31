import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import Item from "./models/Menu.js";
import Order from "./models/Order.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Allow both local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",              // Vite dev server
  "https://restorunt-vtah.vercel.app"   // deployed frontend
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Port & Mongo URI
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODBURI;
const _dirname = path.resolve();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Mongo URI:", URI);
    await mongoose.connect(URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// -------------------- ROUTES --------------------

// GET all menus
app.get("/api/menus", async (req, res) => {
  try {
    const menus = await Item.find();
    console.log("📦 All menus requested");
    res.status(200).json(menus);
  } catch (error) {
    console.error("❌ Error fetching menus:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single menu item by numeric ID
app.get("/api/menus/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const item = await Item.findOne({ id: productId });

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Menu item not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching menu item:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all orders (history)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    console.log("📦 All orders requested");
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single order by numeric ID
app.get("/api/orders/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = await Order.findOne({ id: orderId });

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching order:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new order
app.post("/api/orders", async (req, res) => {
  try {
    const { orderId, items, grandTotal } = req.body;

    const newOrder = new Order({
      id: orderId,
      orderId,
      date: new Date(),
      items: items.reduce((acc, item) => acc + item.quantity, 0),
      itemNames: items.map((item) => item.name),
      itemPrices: items.map((item) => item.price),
      itemQuantities: items.map((item) => item.quantity),
      totalAmount: parseFloat(grandTotal),
      status: "pending",
      paymentMethod: "Credit Card",
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
app.delete("/api/orders", async (req, res) => {
  try {
    await Order.deleteMany({});
    console.log("🗑️ All orders deleted");
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting orders:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- FRONTEND --------------------
app.use(express.static(path.join(_dirname, "/my-project/dist")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "my-project", "dist", "index.html"));
});

// -------------------- START SERVER --------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 App is listening on http://localhost:${PORT}`);
});
