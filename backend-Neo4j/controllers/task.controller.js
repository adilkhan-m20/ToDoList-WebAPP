const { v4: uuid } = require("uuid");
const { getSession } = require("../config/neo4j");

exports.createTask = async (req, res) => {
  const { title, description, status = "todo", due_date } = req.body;

  const session = getSession();
  const id = uuid();

  try {
    const result = await session.run(
      `MATCH (u: User {id: $uid})
            CREATE (t: Task{
            id: $id, title: $title, description: $description,
            status: $status, due_date: $due_date, created_at: datetime()
            })
            CREATE (u)-[:OWNS]->(t)
            RETURN t`,
      {
        uid: req.user.id,
        id,
        title,
        description: description || null,
        status,
        due_date: due_date || null,
      }
    );

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
