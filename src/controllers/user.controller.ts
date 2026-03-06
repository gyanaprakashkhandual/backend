import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
const JWT_SECRET     = process.env.JWT_SECRET as string;

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const token = jwt.sign(
    { username: ADMIN_USERNAME },
    JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.status(200).json({ message: "Login successful.", token });
};

// ─── Check Auth ───────────────────────────────────────────────────────────────
export const checkAuth = (req: Request, res: Response): void => {
  const user = (req as any).user as { username: string };
  res.status(200).json({ authenticated: true, username: user.username });
};