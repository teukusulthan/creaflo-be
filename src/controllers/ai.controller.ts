import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { aiComplete } from "../utils/aiCient";

type Lang = "id" | "en";

function getLang(value: any): Lang {
  return value === "en" ? "en" : "id";
}

/**
 * Generic endpoint jika kamu mau 1 pintu untuk 4 fitur.
 * Body: { tool: "caption" | "hook" | "idea" | "hashtag", input: string, lang?: "id" | "en" }
 */
export async function completion(req: Request, res: Response) {
  const { tool, input, lang } = req.body as {
    tool?: "caption" | "hook" | "idea" | "hashtag";
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

  const result = await aiComplete({
    tool,
    input: input.trim(),
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Completion done",
    data: { result },
  });
}

/** POST /api/ai/caption  Body: { input: string, lang?: "id" | "en" } */
export async function caption(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const result = await aiComplete({
    tool: "caption",
    input: input.trim(),
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Caption generated",
    data: { result },
  });
}

/** POST /api/ai/hook  Body: { input: string, lang?: "id" | "en" } */
export async function hook(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const result = await aiComplete({
    tool: "hook",
    input: input.trim(),
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Hook generated",
    data: { result },
  });
}

/** POST /api/ai/ideas  Body: { input: string, lang?: "id" | "en" } */
export async function ideas(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const result = await aiComplete({
    tool: "idea",
    input: input.trim(),
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Ideas generated",
    data: { result },
  });
}

/** POST /api/ai/hashtags  Body: { input: string, lang?: "id" | "en" } */
export async function hashtags(req: Request, res: Response) {
  const { input, lang } = req.body as { input?: string; lang?: Lang };

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new AppError(400, "Field 'input' is required");
  }

  const result = await aiComplete({
    tool: "hashtag",
    input: input.trim(),
    lang: getLang(lang),
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Hashtags generated",
    data: { result },
  });
}
