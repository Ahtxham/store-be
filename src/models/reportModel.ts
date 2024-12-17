import mongoose, { Document, Model } from "mongoose";

export interface IReport extends Document {
  reason: string;
  post: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}

const reportSchema = new mongoose.Schema<IReport>(
  {
    reason: {
      type: String,
      required: [true, "Reason is required"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
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

export const Report = mongoose.model<IReport>("Report", reportSchema);
