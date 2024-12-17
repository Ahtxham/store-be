import { Request, Response } from "express";
import { Pet } from "@models/petModel";
import { statusCodes } from "@constants/statusCodes";
import { handleFileUpload } from "@utils/fileHelper";

export const createPet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, breed, gender, dob, petmap, location } = req.body;
    const owner = (req.user as any)?.id;
    let image: string = "";
    if (req.file) {
      image = await handleFileUpload(req.file);
    }
    const pet = new Pet({
      name,
      breed,
      gender,
      dob,
      petmap,
      location,
      owner,
      image,
    });
    await pet.save();
    return res.status(statusCodes.CREATED).json(pet);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating pet", error });
  }
};

export const getPets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const pets = await Pet.find({ owner });
    return res.status(statusCodes.OK).json(pets);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching pets", error });
  }
};

export const getPetById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const pet = await Pet.findOne({ _id: req.params.id, owner });
    if (!pet) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Pet not found" });
    }
    return res.status(statusCodes.OK).json(pet);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching pet", error });
  }
};

export const updatePet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, breed, gender, dob, petmap, location } = req.body;
    const owner = (req.user as any)?.id;
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner },
      { name, breed, gender, dob, petmap, location },
      { new: true }
    );
    if (!pet) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Pet not found" });
    }
    return res.status(statusCodes.OK).json(pet);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating pet", error });
  }
};

export const deletePet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner });
    if (!pet) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Pet not found" });
    }
    return res
      .status(statusCodes.OK)
      .json({ message: "Pet deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting pet", error });
  }
};
