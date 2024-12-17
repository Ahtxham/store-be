import { Request, Response } from "express";
import { Post } from "@models/postModel";
import { statusCodes } from "@constants/statusCodes";

export const likePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    if (post.likes.includes(owner)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Post already liked" });
    }

    post.likes.push(owner);
    await post.save();
    return res.status(statusCodes.OK).json(post);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error liking post", error });
  }
};

export const unlikePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    if (!post.likes.includes(owner)) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Post not liked yet" });
    }

    post.likes = post.likes.filter(
      (like) => like.toString() !== owner.toString()
    );
    await post.save();
    return res.status(statusCodes.OK).json(post);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error unliking post", error });
  }
};

export const getLikes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.postId).populate("likes");

    if (!post) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    return res.status(statusCodes.OK).json(post.likes);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching likes", error });
  }
};
