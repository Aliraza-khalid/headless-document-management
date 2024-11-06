import { NextFunction, Request, Response } from "express";

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  return res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
