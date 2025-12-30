import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import * as schema from "./schema";

const dataDir = join(process.cwd(), "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(join(dataDir, "marginalia.db"));
sqlite.exec("PRAGMA journal_mode = WAL");
sqlite.exec("PRAGMA synchronous = NORMAL");
sqlite.exec("PRAGMA foreign_keys = ON");
sqlite.exec("PRAGMA cache_size = 10000");
sqlite.exec("PRAGMA temp_store = MEMORY");

export const db = drizzle(sqlite, { schema });
export const rawdb = sqlite;

if (process.env.NODE_ENV !== "production") {
  migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
}

export const tx = <T>(callback: Parameters<typeof db.transaction<T>>[0]) =>
  db.transaction(callback);
