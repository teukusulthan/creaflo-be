import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  let token: string | undefined;

  if (header?.startsWith("Bearer ")) {
    token = header.slice(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    throw new AppError(401, "No token provided");
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
