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
import { Users } from "./users";
import { relations } from "drizzle-orm";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const Documents = pgTable("documents", {
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
    .references(() => Users.id),
  ...timestampColumns,
});

export const DocumentRelations = relations(Documents, ({ one, many }) => ({
  author: one(Users, {
    fields: [Documents.authorId],
    references: [Users.id],
  }),
  usersAuthorized: many(Users),
}));

export type DocumentDAO = typeof Documents.$inferSelect & {
  usersAuthorized?: string[];
};

export type NewDocument = typeof Documents.$inferInsert;
