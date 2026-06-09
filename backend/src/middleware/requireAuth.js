import { verifyToken } from "../utils/auth.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.user = payload;
  next();
};
