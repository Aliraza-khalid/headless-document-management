import { NextFunction, Request, Response } from "express";
import { LoginDTO } from "../dto/auth.dto";
import { login } from "../servcies/auth.service";
import { CustomError } from "../middlewares/error.middleware";

export async function Login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = LoginDTO.safeParse(req.body);
    if (!validation.success)
      throw new CustomError(
        validation.error.issues[0].message,
        400,
        validation.error.issues
      );

    const data = await login(validation.data);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
