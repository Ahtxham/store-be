import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dob: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

export { User };

export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  password?: string;
  createdAt: Date;
  dob?: Date;
  gender?: string;
  image?: string;
}

export interface UserType {
  email: string;
  username: string;
  password?: string;
  dob?: Date;
  gender?: string;
  image?: string;
}
