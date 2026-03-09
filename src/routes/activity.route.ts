import { Router } from "express";
import {
  toggleLike,
  getLikes,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getAllActivities,
} from "../controllers/activity.controller.js";

const router = Router({ mergeParams: true });
// mergeParams: true  →  inherits :musicId from the parent music router

// ─────────────────────────────────────────────────────────────────────────────
//  BASE: /api/music/:musicId
// ─────────────────────────────────────────────────────────────────────────────

// ── Likes ─────────────────────────────────────────────────────────────────────

/**
 * POST   /api/music/:musicId/like
 * Toggle like / unlike on a track.
 * Body: { userId: string }
 */
router.post("/like", toggleLike);

/**
 * GET    /api/music/:musicId/likes
 * Get total like count and whether the requesting user liked the track.
 * Query: ?userId=<string>   (optional — omit if not authenticated)
 */
router.get("/likes", getLikes);

// ── Comments ──────────────────────────────────────────────────────────────────

/**
 * POST   /api/music/:musicId/comments
 * Add a new comment to a track.
 * Body: { userId: string, text: string }
 */
router.post("/comments", addComment);

/**
 * GET    /api/music/:musicId/comments
 * Fetch all comments for a track (newest first, paginated).
 * Query: ?page=1&limit=20
 */
router.get("/comments", getComments);

/**
 * PATCH  /api/music/:musicId/comments/:commentId
 * Edit an existing comment (owner only).
 * Body: { userId: string, text: string }
 */
router.patch("/comments/:commentId", updateComment);

/**
 * DELETE /api/music/:musicId/comments/:commentId
 * Delete a comment (owner only).
 * Query: ?userId=<string>
 */
router.delete("/comments/:commentId", deleteComment);

// ── Combined feed ─────────────────────────────────────────────────────────────

/**
 * GET    /api/music/:musicId/activities
 * Get ALL activity (likes + comments) for a track in one call.
 */
router.get("/activities", getAllActivities);

export default router;