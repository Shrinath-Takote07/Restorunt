// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: {
      type: Number,
      required: true,
    },
    itemNames: {
      type: [String],
      required: true,
    },
    itemPrices: {
      type: [Number],
      required: true,
    },
    itemQuantities: {
      type: [Number],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "pending"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Cash", "PayPal"],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
