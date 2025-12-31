// import mongoose from "mongoose";

// const ItemSchema = new mongoose.Schema(
//   {
//     id: {
//       type: Number,
//       required: true,
//       unique: true, // ensures no duplicate numeric IDs
//       index: true, // adds index for faster lookups
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true, // removes extra spaces
//     },
//     category: {
//       type: String,
//       required: true,
//       lowercase: true, // normalize category values
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0, // prevent negative prices
//     },
//     deliveryTime: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String,
//       default: "🍽️", // fallback emoji if none provided
//     },
//     popular: {
//       type: Boolean,
//       default: false,
//     },
//     ingredients: {
//       type: [String], // array of strings
//       default: [],
//     },
//     steps: {
//       type: [String], // array of strings
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// // ✅ Export with singular name, Mongoose auto-pluralizes to "items"
// export default mongoose.model("Items", ItemSchema);

import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "🍽️",
    },
    popular: {
      type: Boolean,
      default: false,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ Use singular name → collection will be "items"
export default mongoose.model("Item", ItemSchema);
