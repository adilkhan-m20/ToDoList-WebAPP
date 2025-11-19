const pool = require("../config/db");

exports.createTask = async (req, res) => {
  const { title, description, due_date, status } = req.body;
  const user_id = req.user.id;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, description || null, status || "todo", due_date || null]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT t.*, json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL) AS categories
        FROM tasks t
        LEFT JOIN task_categories tc ON tc.task_id = t.id
        LEFT JOIN categories c ON c.id = tc.category_id
        WHERE t.user_id = $1
        GROUP BY t.id
        ORDER BY t.created_at DESC`,
      [user_id]
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTask = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT t.*, json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL) AS categories
        FROM tasks t
        LEFT JOIN task_categories tc ON tc.task_id = t.id
        LEFT JOIN categories c ON c.id = tc.category_id
        WHERE t.user_id = $1 AND t.id = $2
        GROUP BY t.id`,
      [user_id, id]
    );
    const task = result.rows[0];
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;

  try {
    // ensure task belongs to user
    const check = await pool.query(
      "SELECT id FROM tasks WHERE id=$1 AND user_id=$2",
      [id, user_id]
    );
    if (check.rowCount === 0)
      return res.status(404).json({ error: "Task not found" });

    const result = await pool.query(
      `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description),
        due_date = COALESCE($3, due_date), status = COALESCE($4, status)
        WHERE id = $5 RETURNING *`,
      [title, description, due_date, status, id]
    );

    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ deleted: true, task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignCategory = async (req, res) => {
  const user_id = req.user.id;
  const { id: taskId, catId } = req.params;

  try {
    // ensure the task belongs to the user
    const check = await pool.query(
      "SELECT id FROM tasks WHERE id=$1 AND user_id=$2",
      [taskId, user_id]
    );
    if (check.rowCount === 0)
      return res.status(404).json({ error: "Task not found" });

    // ensure category exists
    const cat = await pool.query("SELECT id FROM categories WHERE id=$1", [
      catId,
    ]);
    if (cat.rowCount === 0)
      return res.status(404).json({ error: "Category not found" });

    // insert if not exists
    await pool.query(
      `INSERT INTO task_categories (task_id, category_id)
        SELECT $1, $2 WHERE NOT EXISTS (
        SELECT 1 FROM task_categories WHERE task_id=$1 AND category_id=$2
        )`,
      [taskId, catId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeCategory = async (req, res) => {
  const user_id = req.user.id;
  const { id: taskId, catId } = req.params;
  try {
    const check = await pool.query(
      "SELECT id FROM tasks WHERE id=$1 AND user_id=$2",
      [taskId, user_id]
    );
    if (check.rowCount === 0)
      return res.status(404).json({ error: "Task not found" });

    await pool.query(
      "DELETE FROM task_categories WHERE task_id=$1 AND category_id=$2",
      [taskId, catId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
