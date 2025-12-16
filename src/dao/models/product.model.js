import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String }
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model(productCollection, productSchema);
