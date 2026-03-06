import { Router } from "express";
import { login, checkAuth } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/user/login  — public
router.post("/login", login);

// GET  /api/user/check  — protected
router.get("/check", protect, checkAuth);

export default router;