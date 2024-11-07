import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function JWTMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Auth Token Not Found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as Request["user"];
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Auth Token" });
  }
}
