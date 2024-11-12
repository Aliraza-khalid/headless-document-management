import {
  jsonb,
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  customType,
} from "drizzle-orm/pg-core";
import timestampColumns from "../../utils/timestampColumns";
import { UserTable } from "./User";
import { relations } from "drizzle-orm";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const DocumentTable = pgTable("documents", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  data: bytea().notNull(),
  mimeType: text().notNull(),
  size: integer().notNull(),
  tags: text().array().default([]),
  metaData: jsonb(),
  isProtected: boolean().notNull().default(true),
  authorId: uuid()
    .notNull()
    .references(() => UserTable.id),
  ...timestampColumns,
});

export const DocumentRelations = relations(DocumentTable, ({ one, many }) => ({
  author: one(UserTable, {
    fields: [DocumentTable.authorId],
    references: [UserTable.id],
  }),
  usersAuthorized: many(UserTable),
}));

export type DocumentDAO = typeof DocumentTable.$inferSelect & {
  usersAuthorized?: string[];
};

export type NewDocument = typeof DocumentTable.$inferInsert;
