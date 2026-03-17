import { Router } from "express";
import {
  getAllMusic, getMusicById, createMusic, updateMusic, deleteMusic,
  toggleLike, getLikes,
  addComment, getComments, updateComment, deleteComment,
} from "../controllers/music.controller.js";

const router = Router();

// ─── Music CRUD ───────────────────────────────────────────────────────────────
router.get("/",          getAllMusic);
router.get("/:id",       getMusicById);

router.post("/",      async (req, res, next) => {
  await (["/api/music*"]);
  next();
}, createMusic);

router.put("/:id",    async (req, res, next) => {
  await  (["/api/music*"]);
  next();
}, updateMusic);

router.delete("/:id", async (req, res, next) => {
  await  (["/api/music*"]);
  next();
}, deleteMusic);

// ─── Likes ────────────────────────────────────────────────────────────────────
router.post("/:id/like",  async (req, res, next) => {
  await  ([`/api/music/${req.params.id}/likes*`]);
  next();
}, toggleLike);

router.get("/:id/likes",     getLikes);

// ─── Comments ─────────────────────────────────────────────────────────────────
router.post("/:id/comments", async (req, res, next) => {
  await  ([`/api/music/${req.params.id}/comments*`]);
  next();
}, addComment);

router.get("/:id/comments",                  getComments);

router.patch("/:id/comments/:commentId",  async (req, res, next) => {
  await  ([`/api/music/${req.params.id}/comments*`]);
  next();
}, updateComment);

router.delete("/:id/comments/:commentId", async (req, res, next) => {
  await  ([`/api/music/${req.params.id}/comments*`]);
  next();
}, deleteComment);

export default router;