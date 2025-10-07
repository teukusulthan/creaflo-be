import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
  })
  .strict();

export type RegisterBody = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email or format"),
    password: z.string().min(8, "Password is required"),
  })
  .strict();

export type LoginBody = z.infer<typeof loginSchema>;
