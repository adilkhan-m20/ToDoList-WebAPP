const { getSession } = require("../config/neo4j");

async function ensureConstraints() {
  const session = getSession();
  try {
    await session.run(
      `CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE`
    );
    await session.run(
      `CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE`
    );
    await session.run(
      `CREATE CONSTRAINT IS NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE`
    );
    await session.run(
      `CREATE CONSTRAINT IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE`
    );
    console.log("Neo4j constraints ensured");
  } finally {
    session.close();
  }
}

module.exports = { ensureConstraints };
