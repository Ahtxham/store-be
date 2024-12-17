import { Request, Response } from "express";
import { Post } from "@models/postModel";
import { statusCodes } from "@constants/statusCodes";
import { handleFileUpload } from "@utils/fileHelper";

export const createPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { pet, location, description, hashtags, isPublic } = req.body;
    const owner = (req.user as any)?.id;
    let media: string = "";
    if (req.file) {
      media = await handleFileUpload(req.file);
    }
    const post = new Post({
      media,
      pet,
      location,
      description,
      hashtags: hashtags ? hashtags.split(",") : [],
      isPublic,
      owner,
    });
    await post.save();
    return res.status(statusCodes.CREATED).json(post);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating post", error });
  }
};

export const getPosts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const posts = await Post.find({ owner }).populate("pet");
    return res.status(statusCodes.OK).json(posts);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching posts", error });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const post = await Post.findOne({ _id: req.params.id, owner }).populate(
      "pet"
    );
    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
    return res.status(statusCodes.OK).json(post);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching post", error });
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { pet, location, description, hashtags, isPublic } = req.body;
    const owner = (req.user as any)?.id;
    let updateData: any = {
      pet,
      location,
      description,
      hashtags: hashtags ? hashtags.split(",") : [],
      isPublic,
    };

    if (req.file) {
      const media = await handleFileUpload(req.file);
      updateData.media = media;
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, owner },
      updateData,
      { new: true }
    );
    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
    return res.status(statusCodes.OK).json(post);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating post", error });
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const post = await Post.findOneAndDelete({ _id: req.params.id, owner });
    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
    return res
      .status(statusCodes.OK)
      .json({ message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting post", error });
  }
};
