import { relations, getTableColumns } from "drizzle-orm";
import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { DocumentTable } from "./Document";

export const UserRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: UserRoleEnum().notNull(),
});

export const UserRelations = relations(UserTable, ({ many }) => ({
  documentsAuthored: many(DocumentTable),
  documentsAuthorized: many(DocumentTable),
}));

export type UserDAO = typeof UserTable.$inferSelect;
export type NewUser = typeof UserTable.$inferInsert;

export const UserModel = getTableColumns(UserTable);
