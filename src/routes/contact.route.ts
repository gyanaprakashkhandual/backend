import { Router, Request, Response } from "express";
import { sendContactMessage } from "../controllers/contact.controller";

const router = Router();

/**
 * POST /api/contact
 *
 * Body (JSON):
 * {
 *   name:    string   – visitor's full name
 *   email:   string   – visitor's email address
 *   subject: string   – message subject
 *   message: string   – message body (max 5000 chars)
 * }
 *
 * Responses:
 *   200  { success: true,  message: "..." }
 *   400  { success: false, message: "...", errors: { field: "..." } }
 *   503  { success: false, message: "Mail server error" }
 */
router.post("/", sendContactMessage);

/**
 * GET /api/contact/health
 * Quick endpoint to confirm the contact route is reachable.
 */
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Contact route is healthy." });
});

export default router;