import mongoose, { Document, Model } from "mongoose";

export interface IPost extends Document {
  media: string;
  pet: mongoose.Types.ObjectId;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  hashtags: string[];
  isPublic: boolean;
  owner: mongoose.Types.ObjectId;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    media: {
      type: String,
      required: [true, "Media is required"],
    },
    pet: {
      type: mongoose.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    description: {
      type: String,
      trim: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>("Post", postSchema);
