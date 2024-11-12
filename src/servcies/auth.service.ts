import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserResponseDTO } from "../dto/users.dto";
import { LoginDTO } from "../dto/auth.dto";
import { userModelToDto } from "../mappers/user.mapper";
import { CustomError } from "../middlewares/Error.middleware";

const SALT_ROUNDS = 10;

export async function login(
  data: LoginDTO
): Promise<{ token: string; user: UserResponseDTO }> {
  const user: any = {};
  // const user = await getUserByEmail(data.email);

  if (!user) throw new CustomError("User Not Found", 404);

  const passwordMatch = await verifyPassword(data.password, user.password);

  if (!passwordMatch) throw new CustomError("Invalid Credentials", 401);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: userModelToDto(user),
  };
}

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

export async function verifyPassword(password: string, hash: string) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

export function generateToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}
