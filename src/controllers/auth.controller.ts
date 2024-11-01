import { NextFunction, Request, Response } from "express";
import { LoginDto } from "../dto/auth.dto";
import { getUserByEmail } from "../servcies/users.service";
import { generateToken, verifyPassword } from "../servcies/auth.service";

export async function Login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const validation = LoginDto.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation);

    const { email, password } = validation.data;

    const user = await getUserByEmail(email);

    if (!user)
      return res.json({
        success: false,
        message: "User Not Found",
      });

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
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
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}
