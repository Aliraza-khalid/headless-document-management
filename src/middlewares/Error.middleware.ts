import { NextFunction, Request, Response } from "express";

export default function ErrorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  return res.status(500).json({
    success: false,
    error,
  });
}
