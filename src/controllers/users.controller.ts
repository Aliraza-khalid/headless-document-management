import { NextFunction, Request, Response } from "express";
import UserService from "../servcies/users.service";
import { CreateUserDTO } from "../dto/users.dto";
import { CustomError } from "../middlewares/Error.middleware";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import JWTMiddleware from "../middlewares/JWT.middleware";
import { inject } from "inversify";
import { ContainerTokens } from "../types/container";
import AdminMiddleware from "../middlewares/Admin.middleware";

@controller("/user", JWTMiddleware)
export default class UserController {
  constructor(
    @inject(ContainerTokens.UserService)
    private readonly userService: UserService
  ) {}

  @httpPost("/", AdminMiddleware)
  async CreateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const validation = CreateUserDTO.safeParse(req.body);
      if (!validation.success)
        throw new CustomError(
          validation.error.issues[0].message,
          400,
          validation.error.issues
        );

      const data = await this.userService.createUser(validation.data);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/profile")
  async GetUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const userId = req.user.userId;

      const data = await this.userService.getUserById(userId);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  @httpGet("/:userId", AdminMiddleware)
  async GetUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.params.userId;

      const data = await this.userService.getUserById(userId);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
