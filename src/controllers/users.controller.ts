import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createUser, getUserById } from "../servcies/users.service";
import { CreateUserDto } from "../dto/users.dto";
import { hashPassword } from "../servcies/auth.service";

export async function CreateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = CreateUserDto.safeParse(req.body);
    if (!validation.success) return res.json(validation);

    const hashedPassword = await hashPassword(validation.data.password);
    // const id = uuidv4();

    const data = await createUser({
      ...validation.data,
      // id,
      password: hashedPassword,
    });

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
