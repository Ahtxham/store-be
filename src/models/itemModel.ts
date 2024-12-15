import mongoose, { Document, Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  images: string[];
  price: number;
  description?: string;
  category: mongoose.Types.ObjectId;
}

const itemSchema = new mongoose.Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model<IItem>("Item", itemSchema);
