import mongoose, { Document, Model } from "mongoose";

export interface IPet extends Document {
  name: string;
  breed: string;
  gender: string;
  dob: Date;
  petmap: boolean;
  location: string;
  owner: mongoose.Types.ObjectId;
}

const petSchema = new mongoose.Schema<IPet>(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, "Pet breed is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Pet gender is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Pet date of birth is required"],
    },
    petmap: {
      type: Boolean,
      required: [true, "Pet map status is required"],
    },
    location: {
      type: String,
      required: [true, "Pet location is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

export const Pet = mongoose.model<IPet>("Pet", petSchema);
