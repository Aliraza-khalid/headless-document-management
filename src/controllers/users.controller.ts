import { NextFunction, Request, Response } from "express";
import { createUser, getUserById } from "../servcies/users.service";
import { CreateUserDTO } from "../dto/users.dto";
import { CustomError } from "../middlewares/Error.middleware";

export async function CreateUser(
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

    const data = await createUser(validation.data);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const userId = req.params.userId;

    const data = await getUserById(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const userId = req.user.userId;

    const data = await getUserById(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
