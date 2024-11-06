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
import { User } from "./User";
import { relations } from "drizzle-orm";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const Document = pgTable("documents", {
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
    .references(() => User.id),
  ...timestampColumns,
});

export const DocumentRelations = relations(Document, ({ one, many }) => ({
  author: one(User, {
    fields: [Document.authorId],
    references: [User.id],
  }),
  usersAuthorized: many(User),
}));

export type DocumentDAO = typeof Document.$inferSelect & {
  usersAuthorized?: string[];
};

export type NewDocument = typeof Document.$inferInsert;
