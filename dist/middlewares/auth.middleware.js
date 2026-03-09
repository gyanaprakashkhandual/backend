import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { username, iat, exp }
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Token is invalid or expired." });
    }
};
