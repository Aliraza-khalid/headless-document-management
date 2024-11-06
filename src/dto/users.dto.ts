import z from "zod";
import { UserRole } from "../enum/UserRoleEnum";

export const CreateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  role: UserRole,
}).strict();

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export type UserResponseDTO = {
  id: string,
  email: string,
  role: string
}
