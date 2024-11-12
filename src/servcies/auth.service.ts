import jwt from "jsonwebtoken";
import { UserResponseDTO } from "../dto/users.dto";
import { LoginDTO } from "../dto/auth.dto";
import { userModelToDto } from "../mappers/user.mapper";
import { CustomError } from "../middlewares/Error.middleware";
import { inject, injectable } from "inversify";
import { ContainerTokens } from "../types/container";
import UserService from "./users.service";
import HashService from "./hash.service";
import LoggerService from "./logger.service";

@injectable()
export default class AuthService {

  constructor(
    @inject(ContainerTokens.Logger)
    private readonly loggerService: LoggerService,
    @inject(ContainerTokens.UserService)
    private readonly userService: UserService,
    @inject(ContainerTokens.HashService)
    private readonly hashService: HashService
  ) {}

  async login(
    data: LoginDTO
  ): Promise<{ token: string; user: UserResponseDTO }> {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user) throw new CustomError("User Not Found", 404);

    const passwordMatch = await this.hashService.verifyPassword(
      data.password,
      user.password
    );

    if (!passwordMatch) throw new CustomError("Invalid Credentials", 401);

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    this.loggerService.info(`Login Success - ${user.email}`)
    return {
      token,
      user: userModelToDto(user),
    };
  }

  private generateToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }
}
