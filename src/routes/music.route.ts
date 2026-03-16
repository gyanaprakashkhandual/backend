import { Router } from "express";
import {
  getAllMusic, getMusicById, createMusic, updateMusic, deleteMusic,
  toggleLike, getLikes,
  addComment, getComments, updateComment, deleteComment,
} from "../controllers/music.controller.js";
import { cache, invalidateCache } from "../middlewares/cache.middleware.js";

const router = Router();

// ─── Music CRUD ───────────────────────────────────────────────────────────────
router.get("/",       cache(600),  getAllMusic);
router.get("/:id",    cache(600),  getMusicById);

router.post("/",      async (req, res, next) => {
  await invalidateCache(["/api/music*"]);
  next();
}, createMusic);

router.put("/:id",    async (req, res, next) => {
  await invalidateCache(["/api/music*"]);
  next();
}, updateMusic);

router.delete("/:id", async (req, res, next) => {
  await invalidateCache(["/api/music*"]);
  next();
}, deleteMusic);

// ─── Likes ────────────────────────────────────────────────────────────────────
router.post("/:id/like",  async (req, res, next) => {
  await invalidateCache([`/api/music/${req.params.id}/likes*`]);
  next();
}, toggleLike);

router.get("/:id/likes",  cache(60),  getLikes);

// ─── Comments ─────────────────────────────────────────────────────────────────
router.post("/:id/comments", async (req, res, next) => {
  await invalidateCache([`/api/music/${req.params.id}/comments*`]);
  next();
}, addComment);

router.get("/:id/comments",               cache(120),  getComments);

router.patch("/:id/comments/:commentId",  async (req, res, next) => {
  await invalidateCache([`/api/music/${req.params.id}/comments*`]);
  next();
}, updateComment);

router.delete("/:id/comments/:commentId", async (req, res, next) => {
  await invalidateCache([`/api/music/${req.params.id}/comments*`]);
  next();
}, deleteComment);

export default router;