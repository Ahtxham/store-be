import { Request, Response } from "express";
import { Store } from "@models/storeModel";
import { statusCodes } from "@constants/statusCodes";

export const createStore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, description } = req.body;
    const store = new Store({ name, description });
    await store.save();
    return res.status(statusCodes.CREATED).json(store);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating store", error });
  }
};

export const getStores = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const stores = await Store.find();
    return res.status(statusCodes.OK).json(stores);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching stores", error });
  }
};

export const getStoreById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Store not found" });
    }
    return res.status(statusCodes.OK).json(store);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching store", error });
  }
};

export const updateStore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, description } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!store) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Store not found" });
    }
    return res.status(statusCodes.OK).json(store);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating store", error });
  }
};

export const deleteStore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Store not found" });
    }
    return res
      .status(statusCodes.OK)
      .json({ message: "Store deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting store", error });
  }
};
