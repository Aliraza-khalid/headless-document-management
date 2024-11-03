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
  metaData: jsonb(),
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
