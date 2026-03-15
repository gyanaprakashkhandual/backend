import { Router } from "express";
import {
  getAllMusic, getMusicById, createMusic, updateMusic, deleteMusic,
  toggleLike, getLikes,
  addComment, getComments, updateComment, deleteComment,
} from "../controllers/music.controller.js";

const router = Router();

// ─── Music CRUD ───────────────────────────────────────────────────────────────
router.get("/",    getAllMusic);
router.get("/:id", getMusicById);
router.post("/",   createMusic);
router.put("/:id", updateMusic);
router.delete("/:id", deleteMusic);

// ─── Likes ────────────────────────────────────────────────────────────────────
router.post("/:id/like",  toggleLike);  // body: { userId }
router.get("/:id/likes",  getLikes);    // query: ?userId

// ─── Comments ─────────────────────────────────────────────────────────────────
router.post("/:id/comments",               addComment);    // body: { userId, text }
router.get("/:id/comments",                getComments);   // query: ?page&limit
router.patch("/:id/comments/:commentId",   updateComment); // body: { userId, text }
router.delete("/:id/comments/:commentId",  deleteComment); // query: ?userId

export default router;