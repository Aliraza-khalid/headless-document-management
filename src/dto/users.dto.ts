import z from "zod";
import { UserRole } from "../enum/UserRoleEnum";

export const CreateUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  role: UserRole,
});
