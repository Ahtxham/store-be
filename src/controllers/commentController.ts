import { Request, Response } from "express";
import { Comment } from "@models/commentModel";
import { statusCodes } from "@constants/statusCodes";

const COMMENT_EDIT_DELETE_LIMIT = 20 * 60 * 1000; // 20 minutes in milliseconds

export const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { content, post } = req.body;
    const owner = (req.user as any)?.id;
    const comment = new Comment({ content, post, owner });
    await comment.save();
    return res.status(statusCodes.CREATED).json(comment);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating comment", error });
  }
};

export const getComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "owner"
    );
    return res.status(statusCodes.OK).json(comments);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching comments", error });
  }
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { content } = req.body;
    const owner = (req.user as any)?.id;
    const comment = await Comment.findOne({ _id: req.params.id, owner });

    if (!comment) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Comment not found" });
    }

    const timeElapsed = Date.now() - new Date(comment.createdAt).getTime();
    if (timeElapsed > COMMENT_EDIT_DELETE_LIMIT) {
      return res
        .status(statusCodes.FORBIDDEN)
        .json({ message: "Cannot edit comment after 20 minutes" });
    }

    comment.content = content;
    await comment.save();
    return res.status(statusCodes.OK).json(comment);
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating comment", error });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const owner = (req.user as any)?.id;
    const comment = await Comment.findOne({ _id: req.params.id, owner });

    if (!comment) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Comment not found" });
    }

    const timeElapsed = Date.now() - new Date(comment.createdAt).getTime();
    if (timeElapsed > COMMENT_EDIT_DELETE_LIMIT) {
      return res
        .status(statusCodes.FORBIDDEN)
        .json({ message: "Cannot delete comment after 20 minutes" });
    }

    await comment.remove();
    return res
      .status(statusCodes.OK)
      .json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting comment", error });
  }
};
