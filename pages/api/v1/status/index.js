import database from "infra/database";

async function status(request, response) {
  console.log("testando");
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  const dbMaxConnectionResult = await database.query("SHOW max_connections;");
  const dbMaxConnectionValue = dbMaxConnectionResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const dbOpenConnectionsResult = await database.query({
    text: "SELECT COUNT(1)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });

  const dbOpenConnectionsValue = dbOpenConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnectionValue),
        opened_connections: dbOpenConnectionsValue,
      },
    },
  });
}

export default status;
