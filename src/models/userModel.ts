import mongoose, { Document, Model } from "mongoose";
import { hashPassword } from "@utils/passwordHelper";
import { LOGUI } from "@constants/logs";

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  age: string;
  city: string;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  image?: string;
}

interface IUserMethods {
  toJSON(): any;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    otp: String,
    otpExpires: Date,
    image: String,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
