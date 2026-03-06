import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = express.Router();

// GET all education entries
router.get("/", (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/education/education.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const educationData = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "All education entries fetched successfully",
      data: educationData.education,
      total: educationData.education.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching education entries",
      error: errorMessage,
    });
  }
});

// GET education by stream/specialty
router.get("/stream/:stream", (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/education/education.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const educationData = JSON.parse(data);
    const stream  = req.params.stream as string;

    const filteredEducation = educationData.education.filter(
      (edu: any) => edu.stream.toLowerCase() === stream.toLowerCase(),
    );

    if (filteredEducation.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No education found for stream '${stream}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Education entries in '${stream}' stream fetched successfully`,
      stream,
      data: filteredEducation,
      total: filteredEducation.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching education by stream",
      error: errorMessage,
    });
  }
});

// GET education by institution
router.get("/institution/:institution", (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/education/education.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const educationData = JSON.parse(data);
    const  institution  = req.params.institution as string;

    const filteredEducation = educationData.education.filter(
      (edu: any) =>
        edu.institution.toLowerCase() === institution.toLowerCase(),
    );

    if (filteredEducation.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No education found for institution '${institution}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Education entries from '${institution}' fetched successfully`,
      institution,
      data: filteredEducation,
      total: filteredEducation.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching education by institution",
      error: errorMessage,
    });
  }
});

// GET single education by title
router.get("/:title", (req: Request, res: Response) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../public/education/education.json",
    );
    const data = fs.readFileSync(filePath, "utf-8");
    const educationData = JSON.parse(data);
    const title = req.params.title as string;

    const foundEducation = educationData.education.find(
      (edu: any) => edu.title.toLowerCase() === title.toLowerCase(),
    );

    if (!foundEducation) {
      return res.status(404).json({
        success: false,
        message: `Education '${title}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Education entry fetched successfully",
      data: foundEducation,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching education",
      error: errorMessage,
    });
  }
});

export default router;
