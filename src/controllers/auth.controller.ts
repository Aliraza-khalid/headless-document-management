import { json, NextFunction, Request, Response } from "express";
import { LoginDTO } from "../dto/auth.dto";
import AuthService from "../servcies/auth.service";
import { CustomError } from "../middlewares/Error.middleware";
import { controller, httpPost } from "inversify-express-utils";
import { ContainerTokens } from "../types/container";
import { inject } from "inversify";

@controller("/auth")
export default class AuthController {
  constructor(
    @inject(ContainerTokens.AuthService)
    private readonly authService: AuthService
  ) {}

  @httpPost("/login")
  async Login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const validation = LoginDTO.safeParse(req.body);
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      const data = await this.authService.login(validation.data);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
