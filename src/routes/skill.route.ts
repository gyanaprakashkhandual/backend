import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = express.Router();

const readSkillsFromDir = (dir: string): any[] => {
  const allSkills: any[] = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      allSkills.push(...readSkillsFromDir(filePath));
    } else if (file.endsWith(".skill.json")) {
      const data = fs.readFileSync(filePath, "utf-8");
      const skills = JSON.parse(data);
      allSkills.push(...skills);
    }
  });

  return allSkills;
};

// GET all skills
router.get("/",   (req: Request, res: Response) => {
  try {
    const skillsDir = path.join(__dirname, "../../public/skills");
    const allSkills = readSkillsFromDir(skillsDir);

    res.status(200).json({
      success: true,
      message: "All skills fetched successfully",
      data: allSkills,
      total: allSkills.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching skills",
      error: errorMessage,
    });
  }
});

// GET skills by category
router.get(
  "/category/:category",
   
  (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const categoryPath = path.join(
        __dirname,
        `../../public/skills/${category}`,
      );

      if (!fs.existsSync(categoryPath)) {
        return res.status(404).json({
          success: false,
          message: `Skill category '${category}' not found`,
        });
      }

      const allSkills = readSkillsFromDir(categoryPath);

      res.status(200).json({
        success: true,
        message: `Skills in '${category}' category fetched successfully`,
        category,
        data: allSkills,
        total: allSkills.length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        message: "Error fetching skills by category",
        error: errorMessage,
      });
    }
  },
);

// GET skills by category and subcategory
router.get(
  "/category/:category/:subcategory",
   
  (req: Request, res: Response) => {
    try {
      const { category, subcategory } = req.params;
      const subcategoryPath = path.join(
        __dirname,
        `../../public/skills/${category}/${subcategory}`,
      );

      if (!fs.existsSync(subcategoryPath)) {
        return res.status(404).json({
          success: false,
          message: `Skill subcategory '${category}/${subcategory}' not found`,
        });
      }

      const allSkills = readSkillsFromDir(subcategoryPath);

      res.status(200).json({
        success: true,
        message: `Skills in '${category}/${subcategory}' fetched successfully`,
        category,
        subcategory,
        data: allSkills,
        total: allSkills.length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        message: "Error fetching skills by category and subcategory",
        error: errorMessage,
      });
    }
  },
);

// GET single skill by name
router.get("/:skillName",   (req: Request, res: Response) => {
  try {
    const skillsDir = path.join(__dirname, "../../public/skills");
    const skillName = req.params.skillName as string;
    const allSkills = readSkillsFromDir(skillsDir);

    const foundSkill = allSkills.find(
      (s: any) => s.skillName.toLowerCase() === skillName.toLowerCase(),
    );
    if (!foundSkill) {
      return res.status(404).json({
        success: false,
        message: `Skill '${skillName}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill fetched successfully",
      data: foundSkill,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error fetching skill",
      error: errorMessage,
    });
  }
});

export default router;
