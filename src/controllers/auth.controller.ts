import { NextFunction, Request, Response } from "express";
import { LoginDto } from "../dto/auth.dto";
import { getUserByEmail } from "../servcies/users.service";
import { generateToken } from "../servcies/auth.service";

export async function Login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = LoginDto.safeParse(req.body);
    if (!validation.success) return res.json(validation);

    const user = await getUserByEmail(req.body.email);

    if (!user)
      return res.json({
        success: false,
        message: "User Not Found",
      });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
