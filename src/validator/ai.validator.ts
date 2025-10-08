import { z } from "zod";

export const toolEnum = z.enum(["caption", "hook", "idea", "hashtag"]);
export const langEnum = z.enum(["id", "en"]);

export const completionSchema = z.object({
  tool: toolEnum,
  input: z.string().min(1).max(2000),
  lang: langEnum.default("id"),
});

export const simpleInputSchema = z.object({
  input: z.string().min(1).max(2000),
  lang: langEnum.default("id"),
});
