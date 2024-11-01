import { timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
} as const

export default timestamps;