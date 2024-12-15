import mongoose, { Document, Model } from "mongoose";

export interface IStore extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

const storeSchema = new mongoose.Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Store = mongoose.model<IStore>("Store", storeSchema);
