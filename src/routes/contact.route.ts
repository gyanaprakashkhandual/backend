import { Router, Request, Response } from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", sendContactMessage);

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Contact route is healthy." });
});

export default router;
