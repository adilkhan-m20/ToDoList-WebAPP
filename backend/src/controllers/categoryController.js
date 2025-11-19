const pool = require("../config/db");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Category exists" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json({ categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
