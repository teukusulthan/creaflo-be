import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";

type JwtPayload = { id: string };

export const getHistory = async (req: Request, res: Response) => {
  const token = req.cookies?.token as string | undefined;
  if (!token) throw new AppError(401, "Unauthorized");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "JWT secret is not configured");

  let userId: string;
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    if (!payload?.id) throw new Error("no id");
    userId = payload.id;
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }

  const limit = Math.min(
    Math.max(parseInt(String(req.query.limit ?? "50"), 10), 1),
    200
  );

  const items = await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      tool: true,
      inputText: true,
      outputText: true,
      isSaved: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Generations fetched",
    data: { items },
  });
};
export const toggleSave = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  if (!userId) throw new AppError(4011, "Unauthorized");

  const { id } = req.params;
  if (!id) throw new AppError(400, "Generation ID is required");

  const gen = await prisma.generation.findFirst({
    where: { id, userId },
  });

  if (!gen) throw new AppError(404, "Generation not found");

  const updated = await prisma.generation.update({
    where: { id },
    data: { isSaved: !gen.isSaved },
    select: {
      id: true,
      isSaved: true,
    },
  });

  res.status(200).json({
    code: 200,
    message: `Generation ${updated.isSaved ? "saved" : "unsaved"}`,
    data: updated,
  });
};
