import { z } from "zod";

export const UserRole = z.enum(["USER", "ADMIN"]);

export type TUserRole = z.infer<typeof UserRole>;

