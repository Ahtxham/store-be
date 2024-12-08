import { User } from "../models/userModel";

export const getUserById = async (userId: string) => {
  return await User.findById(userId).exec();
};

export const updateUser = async (
  userId: string,
  updateData: Partial<typeof User>
) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
};
