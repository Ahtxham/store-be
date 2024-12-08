import { User } from "../models/userModel";

const getUserById = async (userId: string) => {
  return await User.findById(userId).exec();
};

const updateUser = async (userId: string, updateData: Partial<typeof User>) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
};

export const userService = {
  getUserById,
  updateUser,
};
