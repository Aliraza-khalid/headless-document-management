import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Document } from "./Document";

export const UserRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const User = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: UserRoleEnum().notNull(),
});

export const UserRelations = relations(User, ({ many }) => ({
  documentsAuthored: many(Document),
  documentsAuthorized: many(Document),
}));

export type User = typeof User.$inferSelect;
