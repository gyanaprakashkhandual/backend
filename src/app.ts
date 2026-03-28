import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.config.js";

import projectRoutes from "./routes/project.route.js";
import skillRoutes from "./routes/skill.route.js";
import educationRoutes from "./routes/education.route.js";
import experienceRoutes from "./routes/experience.route.js";
import musicRoutes from "./routes/music.route.js";
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import contactRoutes from "./routes/contact.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Database ────────────────────────────────────────────
connectDB();

// ── CORS (must be first) ────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:3000", "https://gyanprakash.vercel.app", "https://khandual.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("/{*path}", cors());

// ── Body Parsers ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../public")));

// ── API Routes ──────────────────────────────────────────
app.use("/api/projects",   projectRoutes);
app.use("/api/skills",     skillRoutes);
app.use("/api/education",  educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/music",      musicRoutes);
app.use("/api/user",       userRoutes);
app.use("/api/blogs",      blogRoutes);
app.use("/api/contact",    contactRoutes);

// ── Health Check ────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ─────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// ── Global Error Handler ────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err }),
  });
});

export default app;