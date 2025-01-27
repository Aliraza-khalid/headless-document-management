import { eq } from "drizzle-orm";
import db from "../db/schema";
import { Users } from "../db/schema/users";

export async function createUser(userData: any) {
  try {
    const newUser = await db.insert(Users).values(userData).returning();
    return newUser[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(Users);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.id, id));
    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));
    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const updatedUser = await db
      .update(Users)
      .set(userData)
      .where(eq(Users.id, id))
      .returning();
    return updatedUser[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const deletedUser = await db
      .delete(Users)
      .where(eq(Users.id, id))
      .returning();
    return deletedUser[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
