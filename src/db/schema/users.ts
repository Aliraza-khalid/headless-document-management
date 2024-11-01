import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const UserRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const Users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: UserRoleEnum().notNull(),
});
