import { User } from "../db/schema/User";
import { UserResponseDTO } from "../dto/users.dto";

export function userModelToDto(user: User): UserResponseDTO {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
