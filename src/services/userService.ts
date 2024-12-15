import { User, IUser } from "@models/userModel";

const userObject = (user: IUser) => {
  if (!user) {
    return null;
  }
  let obj = user.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj._id;
  return obj;
};

export const getUserById = async (userId: string) => {
  let user = await User.findById(userId).exec();
  return userObject(user);
};

export const updateUser = async (userId: string, updateData: any) => {
  let user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).exec();
  return userObject(user);
};

export const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId).exec();
};

export const findUserByEmail = async (email: string) => {
  let user = await User.findOne({ email }).exec();
  return userObject(user);
};

export default {
  getUserById,
  updateUser,
  deleteUser,
  findUserByEmail,
};
