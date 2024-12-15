import { Request, Response } from "express";
import { Category } from "@models/categoryModel";
import { statusCodes } from "@constants/statusCodes";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, picture, description, store } = req.body;
    const category = new Category({ name, picture, description, store });
    await category.save();
    return res.status(statusCodes.CREATED).json(category);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating category", error });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categories = await Category.find({ store: req.params.storeId });
    return res.status(statusCodes.OK).json(categories);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching categories", error });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }
    return res.status(statusCodes.OK).json(category);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching category", error });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, picture, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, picture, description },
      { new: true }
    );
    if (!category) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }
    return res.status(statusCodes.OK).json(category);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }
    return res
      .status(statusCodes.OK)
      .json({ message: "Category deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting category", error });
  }
};
