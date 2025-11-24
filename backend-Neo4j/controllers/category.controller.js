const { v4: uuid } = require("uuid");
const { getSession } = require("../config/neo4j");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const session = getSession();

  try {
    const result = await session.run(
      `MERGE (c: Category {name: $name})
            ON CREATE SET c.id = $id
            RETURN c`,
      { name, id: uuid() }
    );

    const category = result.records[0].get("c").properties;

    res.status(201).json({ category });
  } finally {
    session.close();
  }
};

exports.getAllCategories = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c: Category) RETURN c ORDER BY c.name`
    );
    res.json({ categories: result.records.map((r) => r.get("c").properties) });
  } finally {
    session.close();
  }
};
