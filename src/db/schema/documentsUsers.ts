import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { Users } from "./users";
import { Documents } from "./documents";
import { relations } from "drizzle-orm";

export const DocumentsUsers = pgTable(
  "documents_users",
  {
    userId: uuid()
      .notNull()
      .references(() => Users.id),
    documentId: uuid()
      .notNull()
      .references(() => Documents.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.documentId] }),
  })
);

export const DocumentsUsersRelations = relations(DocumentsUsers, ({ one }) => ({
  user: one(Users, {
    fields: [DocumentsUsers.userId],
    references: [Users.id],
  }),
  document: one(Documents, {
    fields: [DocumentsUsers.documentId],
    references: [Documents.id],
  }),
}));
