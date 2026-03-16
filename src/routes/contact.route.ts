import { Router, Request, Response } from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
import { cache } from "../middlewares/cache.middleware.js";

const router = Router();

router.post("/", cache(3600), sendContactMessage);

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Contact route is healthy." });
});

export default router;
