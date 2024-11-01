import {
  jsonb,
  pgTable,
  text,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import timestampColumns from "../../utils/timestampColumns";
import { Users } from "./users";
import { relations } from "drizzle-orm";

export const Documents = pgTable("documents", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  data: text().notNull().$type<Buffer>(),
  mimeType: text().notNull(),
  size: integer().notNull(),
  metadata: jsonb(),
  isProtected: boolean().default(false),
  uploadedBy: uuid()
    .notNull()
    .references(() => Users.id),
  ...timestampColumns,
});

export const DocumentRelations = relations(Documents, ({ one, many }) => ({
  uploadedBy: one(Users, {
    fields: [Documents.uploadedBy],
    references: [Users.id],
  }),
  usersAuthorized: many(Users),
}));

export type Document = typeof Documents.$inferSelect;
export type NewDocument = typeof Documents.$inferInsert;
