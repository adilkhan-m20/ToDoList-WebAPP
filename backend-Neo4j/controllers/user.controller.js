const { getSession } = require("../config/neo4j");

exports.me = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(`MATCH (u:User {id: $id}) RETURN u`, {
      id: req.user.id,
    });

    const user = result.records[0].get("u").properties;
    delete user.password_hash;

    res.json({ user });
  } finally {
    session.close();
  }
};
