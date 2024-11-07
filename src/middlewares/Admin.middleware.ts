import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enum/UserRoleEnum";

export default function AdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (user.role !== UserRole.Enum.ADMIN)
    return res.status(401).json({ error: "Unauthorized User" });
  next();
}
