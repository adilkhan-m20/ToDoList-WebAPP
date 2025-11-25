const { v4: uuid } = require("uuid");
const { getSession } = require("../config/neo4j");

exports.createTask = async (req, res) => {
  const {
    title,
    description,
    status = "todo",
    due_date,
    categoryId,
  } = req.body;
  const session = getSession();
  const id = uuid();

  try {
    const query = `
      MATCH (u: User {id: $uid})
      CREATE (t: Task {
        id: $id, 
        title: $title, 
        description: $description,
        status: $status, 
        due_date: $due_date, 
        created_at: datetime()
      })
      CREATE (u)-[:OWNS]->(t)
      WITH t
      // Optional: Link category if ID is provided
      CALL {
        WITH t
        MATCH (c:Category {id: $categoryId})
        WHERE $categoryId IS NOT NULL
        MERGE (t)-[:HAS_CATEGORY]->(c)
        RETURN c
      }
      RETURN t
    `;

    const result = await session.run(query, {
      uid: req.user.id,
      id,
      title,
      description: description || null,
      status,
      due_date: due_date || null,
      categoryId: categoryId || null, // Pass null if no category
    });

    res.status(201).json({ task: result.records[0].get("t").properties });
  } finally {
    session.close();
  }
};

exports.getTasks = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u: User {id: $uid})-[:OWNS]->(t: Task)
            OPTIONAL MATCH(t)-[:HAS_CATEGORY]->(c: Category)
            RETURN t, collect(c) AS categories`,
      { uid: req.user.id }
    );

    const tasks = result.records.map((r) => ({
      ...r.get("t").properties,
      categories: r.get("categories").map((c) => c.properties),
    }));

    res.json({ tasks });
  } finally {
    session.close();
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status, title } = req.body;
  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (u:User {id: $uid})-[:OWNS]->(t:Task {id: $id})
       SET t.status = COALESCE($status, t.status),
           t.title = COALESCE($title, t.title)
       RETURN t`,
      { uid: req.user.id, id, status, title }
    );

    if (result.records.length === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ task: result.records[0].get("t").properties });
  } finally {
    session.close();
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const session = getSession();

  try {
    // DETACH DELETE removes the node and its relationships (OWNS, HAS_CATEGORY)
    await session.run(
      `MATCH (u:User {id: $uid})-[:OWNS]->(t:Task {id: $id})
       DETACH DELETE t`,
      { uid: req.user.id, id }
    );
    res.json({ message: "Task deleted" });
  } finally {
    session.close();
  }
};
