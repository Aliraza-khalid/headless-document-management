import { UserDAO } from "../db/schema/User";
import { UserResponseDTO } from "../dto/users.dto";

export function userModelToDto(user: UserDAO): UserResponseDTO {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
