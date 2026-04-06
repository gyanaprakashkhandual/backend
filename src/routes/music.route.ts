import { Router } from "express";
import {
  getAllMusic,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
  toggleLike,
  getLikes,
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/music.controller.js";

const router = Router();

/* Music CRUD Routes */
router.get("/", getAllMusic);
router.get("/:id", getMusicById);
router.post("/", createMusic);
router.put("/:id", updateMusic);
router.delete("/:id", deleteMusic);

/* Likes */
router.post("/:id/like", toggleLike);
router.get("/:id/likes", getLikes);

/* Comments */
router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);
router.patch("/:id/comments/:commentId", updateComment);
router.delete("/:id/comments/:commentId", deleteComment);

export default router;
