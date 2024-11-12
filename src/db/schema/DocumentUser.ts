import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./User";
import { DocumentTable } from "./Document";
import { relations } from "drizzle-orm";

export const DocumentUser = pgTable(
  "documents_users",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id),
    documentId: uuid()
      .notNull()
      .references(() => DocumentTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.documentId] }),
  })
);

export const DocumentUserRelations = relations(DocumentUser, ({ one }) => ({
  user: one(UserTable, {
    fields: [DocumentUser.userId],
    references: [UserTable.id],
  }),
  document: one(DocumentTable, {
    fields: [DocumentUser.documentId],
    references: [DocumentTable.id],
  }),
}));

export type DocumentUserDAO = typeof DocumentUser.$inferSelect;
export type DocumentUser = typeof DocumentUser.$inferInsert;
