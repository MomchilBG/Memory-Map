import { Global, Module } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import * as schema from "./schema.js";

export const DATABASE = Symbol("DATABASE");
export type Database = NodePgDatabase<typeof schema>;

const MIGRATIONS_FOLDER = join(import.meta.dirname, "../../drizzle");
const CONNECT_ATTEMPTS = 10;

// The database may still be starting when the api boots (docker compose, CI),
// so retry before giving up.
async function migrateWithRetry(db: Database) {
  for (let attempt = 1; ; attempt++) {
    try {
      await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
      return;
    } catch (error) {
      if (attempt === CONNECT_ATTEMPTS) throw error;
      await setTimeout(2000);
    }
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: async (): Promise<Database> => {
        const db = drizzle(
          process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/memory_map",
          { schema },
        );
        await migrateWithRetry(db);
        return db;
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
