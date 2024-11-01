import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Documents } from "./documents";

export const UserRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const Users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: UserRoleEnum().notNull(),
});

export const UserRelations = relations(Users, ({ many }) => ({
  documentsAuthored: many(Documents),
  documentsAuthorized: many(Documents),
}));

export type User = typeof Users.$inferSelect;
