import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { aiComplete } from "../utils/aiCient";
import { prisma } from "../connections/client";
import { Tool as ToolEnum } from "@prisma/client";

type Lang = "id" | "en";
type ToolStr = "caption" | "hook" | "idea" | "hashtag";

function getLang(value: any): Lang {
  return value === "en" ? "en" : "id";
}

function getUserId(req: Request): string {
  const id =
    (req as any)?.user?.id ||
    (req as any)?.userId ||
    (resLocals(req)?.user?.id as string | undefined);

  if (!id) throw new AppError(401, "Unauthorized");
  return id;
}

function resLocals(req: Request) {
  return (req.res && req.res.locals) || {};
}

function toEnum(tool: ToolStr): ToolEnum {
  return tool as unknown as ToolEnum;
}

async function generateAndStore(params: {
  userId: string;
  tool: ToolStr;
  input: string;
  lang: Lang;
}) {
  const { userId, tool, input, lang } = params;

  const result = await aiComplete({
    tool,
    input: input.trim(),
    lang,
  });

  const outputText =
    typeof result === "string" ? result : JSON.stringify(result);

  const created = await prisma.generation.create({
    data: {
      userId,
      tool: toEnum(tool),
      inputText: input.trim(),
      outputText,
    },
    select: {
      id: true,
      userId: true,
      tool: true,
      inputText: true,
      outputText: true,
      isSaved: true,
      createdAt: true,
    },
  });

  return { created, result: outputText };
}

export async function completion(req: Request, res: Response) {
  const { tool, input, lang } = req.body as {
    tool?: ToolStr;
    input?: string;
    lang?: Lang;
  };

  if (!tool || !["caption", "hook", "idea", "hashtag"].includes(tool)) {
    throw new AppError(
      400,
      "Field 'tool' must be one of: caption, hook, idea, hashtag"
    );
  }
  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const userId = getUserId(req);
  const { created, result } = await generateAndStore({
    userId,
    tool,
    input,
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Completion done",
    data: { result, generation: created },
  });
}

/** POST /api/ai/caption  Body: { input: string, lang?: "id" | "en" } */
export async function caption(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const userId = getUserId(req);
  const { created, result } = await generateAndStore({
    userId,
    tool: "caption",
    input,
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Caption generated",
    data: { result, generation: created },
  });
}

/** POST /api/ai/hook  Body: { input: string, lang?: "id" | "en" } */
export async function hook(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const userId = getUserId(req);
  const { created, result } = await generateAndStore({
    userId,
    tool: "hook",
    input,
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Hook generated",
    data: { result, generation: created },
  });
}

/** POST /api/ai/ideas  Body: { input: string, lang?: "id" | "en" } */
export async function ideas(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const userId = getUserId(req);
  const { created, result } = await generateAndStore({
    userId,
    tool: "idea",
    input,
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Ideas generated",
    data: { result, generation: created },
  });
}

/** POST /api/ai/hashtags  Body: { input: string, lang?: "id" | "en" } */
export async function hashtags(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const userId = getUserId(req);
  const { created, result } = await generateAndStore({
    userId,
    tool: "hashtag",
    input,
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Hashtags generated",
    data: { result, generation: created },
  });
}
