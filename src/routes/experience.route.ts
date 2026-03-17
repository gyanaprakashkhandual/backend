import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = express.Router();

// GET all experience entries
router.get("/",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/experience/experience.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const experienceData = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "All experience entries fetched successfully",
      data: experienceData.experience,
      total: experienceData.experience.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching experience entries",
      error: errorMessage,
    });
  }
});

// GET experience by company
router.get("/company/:company",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/experience/experience.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const experienceData = JSON.parse(data);
    const company = req.params.commpany as string;

    const filteredExperience = experienceData.experience.filter(
      (exp: any) => exp.company.toLowerCase() === company.toLowerCase(),
    );

    if (filteredExperience.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No experience found at company '${company}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Experience entries from '${company}' fetched successfully`,
      company,
      data: filteredExperience,
      total: filteredExperience.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching experience by company",
      error: errorMessage,
    });
  }
});

// GET experience by role
router.get("/role/:role",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/experience/experience.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const experienceData = JSON.parse(data);
    const role = req.params.role as string;

    const filteredExperience = experienceData.experience.filter((exp: any) =>
      exp.role.toLowerCase().includes(role.toLowerCase()),
    );

    if (filteredExperience.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No experience found for role '${role}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Experience entries for role '${role}' fetched successfully`,
      role,
      data: filteredExperience,
      total: filteredExperience.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching experience by role",
      error: errorMessage,
    });
  }
});

// GET single experience by slug
router.get("/:slug",   (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/experience/experience.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const experienceData = JSON.parse(data);
    const { slug } = req.params;

    const foundExperience = experienceData.experience.find(
      (exp: any) => exp.slug === slug,
    );

    if (!foundExperience) {
      return res.status(404).json({
        success: false,
        message: `Experience with slug '${slug}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience entry fetched successfully",
      data: foundExperience,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching experience",
      error: errorMessage,
    });
  }
});

export default router;
