export const list = async (req, res) => {
  res.json({ data: [] });
};

export const create = async (req, res) => {
  res.status(201).json({ data: req.body });
};
