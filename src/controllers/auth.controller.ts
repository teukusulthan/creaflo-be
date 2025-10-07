import { Request, Response, NextFunction } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    throw new AppError(400, "Name, email, and password are required");
  }

  const emailNorm = email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email: emailNorm } });
  if (exists) {
    throw new AppError(409, "Email is already registered");
  }

  const password_hash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email: emailNorm,
      passwordHash: password_hash,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const token = signToken({ id: user.id, email: user.email });

  res.status(201).json({
    code: 201,
    status: "success",
    message: "Registered successfully",
    data: {
      user_id: user.id,
      name: user.name,
      email: user.email,
      token,
    },
  });
};

export const login = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password)
    throw new AppError(400, "Email and password are required");

  const emailNorm = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: emailNorm } });

  if (!user) throw new AppError(404, "Account is not registered");

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new AppError(401, "Wrong password");

  const token = signToken({ id: user.id, email: user.email });

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Logged in successfully",
    data: {
      user_id: user.id,
      name: user.name,
      email: user.email,
      token,
    },
  });
};
