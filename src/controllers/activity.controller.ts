import { Request, Response } from "express";
import mongoose from "mongoose";
import Activity from "../models/activity.model";
import {
  ActivityType,
  LikeMusicBody,
  CommentMusicBody,
  UpdateCommentBody,
} from "../types/activity.type";

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Returns true if the given string is a valid MongoDB ObjectId */
const isValidId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// ═════════════════════════════════════════════════════════════════════════════
//  LIKE CONTROLLERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/music/:musicId/like
 * Toggle like on a music track.
 * - If the user has not liked the track → create a like activity (liked: true)
 * - If the user already liked the track → remove it               (liked: false)
 */
export const toggleLike = async (
  req: Request<{ musicId: string }, {}, LikeMusicBody>,
  res: Response
): Promise<void> => {
  try {
    const { musicId } = req.params;
    const { userId }  = req.body;

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!userId || !isValidId(userId)) {
      res.status(400).json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(musicId)) {
      res.status(400).json({ success: false, message: "Valid musicId is required" });
      return;
    }

    // ── Check existing like ───────────────────────────────────────────────────
    const existing = await Activity.findOne({
      musicId,
      userId,
      type: ActivityType.LIKE,
    });

    if (existing) {
      // Unlike — remove the document
      await existing.deleteOne();
      res.status(200).json({
        success: true,
        message: "Track unliked successfully",
        data:    null,
        liked:   false,
      });
      return;
    }

    // Like — create new activity
    const like = await Activity.create({
      musicId,
      userId,
      type: ActivityType.LIKE,
    });

    res.status(201).json({
      success: true,
      message: "Track liked successfully",
      data:    like,
      liked:   true,
    });
  } catch (err: any) {
    // Duplicate key race-condition safety net
    if (err.code === 11000) {
      res.status(409).json({ success: false, message: "Already liked this track" });
      return;
    }
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

/**
 * GET /api/music/:musicId/likes
 * Get total like count + whether the requesting user has liked the track.
 */
export const getLikes = async (
  req: Request<{ musicId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { musicId }         = req.params;
    const userId              = req.query.userId as string | undefined;

    if (!isValidId(musicId)) {
      res.status(400).json({ success: false, message: "Valid musicId is required" });
      return;
    }

    // Total count
    const count = await Activity.countDocuments({
      musicId,
      type: ActivityType.LIKE,
    });

    // Did this specific user like it?
    let userLiked = false;
    if (userId && isValidId(userId)) {
      userLiked = !!(await Activity.exists({
        musicId,
        userId,
        type: ActivityType.LIKE,
      }));
    }

    res.status(200).json({
      success:   true,
      message:   "Likes fetched successfully",
      data:      { count, userLiked },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//  COMMENT CONTROLLERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/music/:musicId/comments
 * Add a new comment on a music track.
 */
export const addComment = async (
  req: Request<{ musicId: string }, {}, CommentMusicBody>,
  res: Response
): Promise<void> => {
  try {
    const { musicId }       = req.params;
    const { userId, text }  = req.body;

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!userId || !isValidId(userId)) {
      res.status(400).json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(musicId)) {
      res.status(400).json({ success: false, message: "Valid musicId is required" });
      return;
    }
    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Comment text is required" });
      return;
    }
    if (text.trim().length > 1000) {
      res.status(400).json({ success: false, message: "Comment exceeds 1000 characters" });
      return;
    }

    const comment = await Activity.create({
      musicId,
      userId,
      type:    ActivityType.COMMENT,
      comment: { text: text.trim() },
    });

    // Populate userId so the client gets user info
    await comment.populate("userId", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data:    comment,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

/**
 * GET /api/music/:musicId/comments
 * Get all comments for a music track (newest first).
 * Supports optional pagination via ?page=1&limit=20
 */
export const getComments = async (
  req: Request<{ musicId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { musicId } = req.params;

    if (!isValidId(musicId)) {
      res.status(400).json({ success: false, message: "Valid musicId is required" });
      return;
    }

    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip  = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Activity.find({ musicId, type: ActivityType.COMMENT })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email avatar")
        .lean(),
      Activity.countDocuments({ musicId, type: ActivityType.COMMENT }),
    ]);

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data:    comments,
      total,
      page,
      pages:   Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

/**
 * PATCH /api/music/:musicId/comments/:commentId
 * Edit an existing comment (only the owner can edit).
 */
export const updateComment = async (
  req: Request<{ musicId: string; commentId: string }, {}, UpdateCommentBody & { userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { musicId, commentId } = req.params;
    const { userId, text }       = req.body;

    if (!userId || !isValidId(userId)) {
      res.status(400).json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(musicId) || !isValidId(commentId)) {
      res.status(400).json({ success: false, message: "Valid musicId and commentId are required" });
      return;
    }
    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Comment text is required" });
      return;
    }

    const activity = await Activity.findOne({
      _id:    commentId,
      musicId,
      type:   ActivityType.COMMENT,
    });

    if (!activity) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    // Ownership check
    if (activity.userId.toString() !== userId) {
      res.status(403).json({ success: false, message: "You can only edit your own comments" });
      return;
    }

    // Update the embedded comment text
    activity.comment!.text      = text.trim();
    activity.comment!.updatedAt = new Date();
    await activity.save();

    await activity.populate("userId", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data:    activity,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

/**
 * DELETE /api/music/:musicId/comments/:commentId
 * Delete a comment (only the owner can delete).
 */
export const deleteComment = async (
  req: Request<{ musicId: string; commentId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { musicId, commentId } = req.params;
    const userId                 = req.query.userId as string;

    if (!userId || !isValidId(userId)) {
      res.status(400).json({ success: false, message: "Valid userId query param is required" });
      return;
    }
    if (!isValidId(musicId) || !isValidId(commentId)) {
      res.status(400).json({ success: false, message: "Valid musicId and commentId are required" });
      return;
    }

    const activity = await Activity.findOne({
      _id:    commentId,
      musicId,
      type:   ActivityType.COMMENT,
    });

    if (!activity) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    if (activity.userId.toString() !== userId) {
      res.status(403).json({ success: false, message: "You can only delete your own comments" });
      return;
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data:    null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};

/**
 * GET /api/music/:musicId/activities
 * Get ALL activities (likes + comments) for a track.
 * Useful for a combined activity feed.
 */
export const getAllActivities = async (
  req: Request<{ musicId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { musicId } = req.params;

    if (!isValidId(musicId)) {
      res.status(400).json({ success: false, message: "Valid musicId is required" });
      return;
    }

    const activities = await Activity.find({ musicId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar")
      .lean();

    res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data:    activities,
      total:   activities.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message ?? "Server error" });
  }
};