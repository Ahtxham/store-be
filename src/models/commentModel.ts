import mongoose, { Document, Model } from "mongoose";

export interface IComment extends Document {
  content: string;
  post: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
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

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
