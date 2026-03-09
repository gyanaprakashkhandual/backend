import jwt from "jsonwebtoken";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
// ─── Login ────────────────────────────────────────────────────────────────────
export const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required." });
        return;
    }
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
    }
    const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: "3d" });
    res.status(200).json({ message: "Login successful.", token });
};
// ─── Check Auth ───────────────────────────────────────────────────────────────
export const checkAuth = (req, res) => {
    const user = req.user;
    res.status(200).json({ authenticated: true, username: user.username });
};
