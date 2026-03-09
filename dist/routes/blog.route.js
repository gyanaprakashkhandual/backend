import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const BLOGS_DIR = path.join(__dirname, "../../public/blogs");
// Parse a single .md file into { meta, content }
const parseMdFile = (filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw); // splits frontmatter + body
    return { meta: data, content };
};
// GET /api/blogs — all blogs (meta only, no content)
router.get("/", (req, res) => {
    try {
        const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
        const blogs = files.map(file => {
            const { meta } = parseMdFile(path.join(BLOGS_DIR, file));
            return {
                slug: meta.slug ?? file.replace(".md", ""),
                title: meta.title ?? "",
                description: meta.description ?? "",
                author: meta.author ?? "",
                date: meta.date ?? "",
                tags: meta.tags ?? [],
                coverImage: meta.coverImage ?? null,
                fileName: file,
            };
        });
        // Sort by date descending
        blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            data: blogs,
            total: blogs.length,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Error fetching blogs", error: msg });
    }
});
// GET /api/blogs/:slug — single blog WITH full markdown content
router.get("/:slug", (req, res) => {
    try {
        const { slug } = req.params;
        const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
        // Match by slug in frontmatter OR by filename
        let matched = null;
        for (const file of files) {
            const { meta } = parseMdFile(path.join(BLOGS_DIR, file));
            const fileSlug = meta.slug ?? file.replace(".md", "");
            if (fileSlug === slug) {
                matched = file;
                break;
            }
        }
        if (!matched) {
            return res.status(404).json({ success: false, message: `Blog '${slug}' not found` });
        }
        const { meta, content } = parseMdFile(path.join(BLOGS_DIR, matched));
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: {
                slug: meta.slug ?? matched.replace(".md", ""),
                title: meta.title ?? "",
                description: meta.description ?? "",
                author: meta.author ?? "",
                date: meta.date ?? "",
                tags: meta.tags ?? [],
                coverImage: meta.coverImage ?? null,
                content, // raw markdown string — frontend renders this
            },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Error fetching blog", error: msg });
    }
});
export default router;
