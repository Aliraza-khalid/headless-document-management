import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  // casing: "snake_case",
});

export type DB = NodePgDatabase;
