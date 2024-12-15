import mongoose, { Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  picture?: string;
  description?: string;
  store: mongoose.Types.ObjectId;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
