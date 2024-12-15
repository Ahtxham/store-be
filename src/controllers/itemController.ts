import { Request, Response } from "express";
import { Item } from "@models/itemModel";
import { statusCodes } from "@constants/statusCodes";

export const createItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, images, price, description, category } = req.body;
    const item = new Item({ name, images, price, description, category });
    await item.save();
    return res.status(statusCodes.CREATED).json(item);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating item", error });
  }
};

export const getItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const items = await Item.find({ category: req.params.categoryId });
    return res.status(statusCodes.OK).json(items);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching items", error });
  }
};

export const getItemById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }
    return res.status(statusCodes.OK).json(item);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching item", error });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, images, price, description } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, images, price, description },
      { new: true }
    );
    if (!item) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }
    return res.status(statusCodes.OK).json(item);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating item", error });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Item not found" });
    }
    return res
      .status(statusCodes.OK)
      .json({ message: "Item deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting item", error });
  }
};
