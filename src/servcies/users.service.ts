import { eq } from "drizzle-orm";
import db from "../db/schema";
import { User } from "../db/schema/User";
import { UserResponseDTO } from "../dto/users.dto";
import { userModelToDto } from "../mappers/user.mapper";

export async function createUser(userData: any): Promise<UserResponseDTO> {
  try {
    const [newUser] = await db.insert(User).values(userData).returning();
    return userModelToDto(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserResponseDTO[]> {
  try {
    const users = await db.select().from(User);
    return users.map((user) => userModelToDto(user));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
  try {
    const [user] = await db.select().from(User).where(eq(User.id, id));
    return userModelToDto(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const user = await db.select().from(User).where(eq(User.email, email));
    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  userData: any
): Promise<UserResponseDTO> {
  try {
    const [updatedUser] = await db
      .update(User)
      .set(userData)
      .where(eq(User.id, id))
      .returning();
    return userModelToDto(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    const deletedUser = await db
      .delete(User)
      .where(eq(User.id, id))
      .returning();
    return deletedUser[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
