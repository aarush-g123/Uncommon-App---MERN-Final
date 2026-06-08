import { User } from "../models/index.js";
import { createToken, hashPassword, verifyPassword, verifyToken } from "../utils/auth.js";

const cleanUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
    });

    res.status(201).json({ user: cleanUser(user), token: createToken(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ user: cleanUser(user), token: createToken(user) });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    res.json({ user: cleanUser(user) });
  } catch (err) {
    next(err);
  }
};
