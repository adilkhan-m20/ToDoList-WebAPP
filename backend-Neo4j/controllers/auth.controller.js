const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { getSession } = require("../config/neo4j");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const session = getSession();
  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuid();

  try {
    const result = await session.run(
      `MERGE (u:User {email: $email})
            ON CREATE SET u.id = $id, u.name = $name, u.password_hash = $password_hash, u.created_at = datetime()
            RETURN u`,
      { id, name, email, password_hash: passwordHash }
    );

    const user = result.records[0].get("u").properties;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    delete user.password_hash;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "User already exists or server error" });
  } finally {
    session.close();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (u:User {email: $email}) RETURN u LIMIT 1`,
      { email }
    );

    if (!result.records.length) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const user = result.records[0].get("u").properties;

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } finally {
    session.close();
  }
};
