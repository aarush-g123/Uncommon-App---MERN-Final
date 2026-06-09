import { College } from "../models/index.js";

export const list = async (req, res, next) => {
  try {
    const colleges = await College.findAll({ where: { userId: req.user.sub } });
    res.json({ data: colleges });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, status, deadline, notes } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    const college = await College.create({ name, status, deadline, notes, userId: req.user.sub });
    res.status(201).json({ data: college });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const college = await College.findOne({ where: { id: req.params.id, userId: req.user.sub } });
    if (!college) return res.status(404).json({ error: "Not found" });

    await college.update(req.body);
    res.json({ data: college });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const college = await College.findOne({ where: { id: req.params.id, userId: req.user.sub } });
    if (!college) return res.status(404).json({ error: "Not found" });

    await college.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
