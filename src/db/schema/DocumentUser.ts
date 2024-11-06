import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { User } from "./User";
import { Document } from "./Document";
import { relations } from "drizzle-orm";

export const DocumentUser = pgTable(
  "documents_users",
  {
    userId: uuid()
      .notNull()
      .references(() => User.id),
    documentId: uuid()
      .notNull()
      .references(() => Document.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.documentId] }),
  })
);

export const DocumentsUsersRelations = relations(DocumentUser, ({ one }) => ({
  user: one(User, {
    fields: [DocumentUser.userId],
    references: [User.id],
  }),
  document: one(Document, {
    fields: [DocumentUser.documentId],
    references: [Document.id],
  }),
}));

export type DocumentsUsers = typeof DocumentUser.$inferSelect;
