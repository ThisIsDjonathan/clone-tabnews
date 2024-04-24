import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

async function migrations(request, response) {

  const allowedMethods = ["GET", "POST"];
  if (allowedMethods.includes(request.method)) {
    return response.status(405) - json({
      error: `Method "${request.method} not allowed`
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method == "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      await dbClient.end();
      return response.status(200).json(pendingMigrations);
    } else if (request.method == "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }

    return response.status(405).end();
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Something went wrong" });
  } finally {
    await dbClient.end();
  }
}

export default migrations;
