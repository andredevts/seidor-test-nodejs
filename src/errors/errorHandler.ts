import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { StatusCodes } from "http-status-codes";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
}
