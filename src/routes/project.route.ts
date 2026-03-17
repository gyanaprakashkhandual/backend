import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = express.Router();

router.get("/",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/projects/projects.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const projects = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
      total: projects.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: errorMessage,
    });
  }
});

router.get("/:slug",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/projects/web/project.web.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const projects = JSON.parse(data);

    const project = projects.find(
      (p: any) => p.projectSlug === req.params.slug,
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project '${req.params.slug}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: errorMessage,
    });
  }
});

export default router;
