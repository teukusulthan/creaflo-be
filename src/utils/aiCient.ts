import OpenAI from "openai";
import { AppError } from "../utils/appError";

type Tool = "caption" | "hook" | "idea" | "hashtag";
type Lang = "id" | "en";

const MODEL = "gpt-4o-mini";
const TIMEOUT_MS = 20000;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompts
function sysPrompt(lang: Lang) {
  return lang === "en"
    ? `You are a concise social media copywriter. Always reply with plain text, no emojis unless requested.`
    : `Kamu adalah copywriter konten sosial media yang ringkas dan menarik. Balas hanya teks polos tanpa emoji kecuali diminta.`;
}

function userPrompt(tool: Tool, input: string, lang: Lang) {
  switch (tool) {
    case "caption":
      return lang === "en"
        ? `Write 3 catchy social media captions for: "${input}". Each under 120 characters.`
        : `Tulis 3 caption menarik untuk: "${input}". Setiap caption maksimal 120 karakter.`;
    case "hook":
      return lang === "en"
        ? `Give 5 short video hooks (1 sentence each) for: "${input}". Hooks must instantly spark curiosity.`
        : `Berikan 5 hook pembuka video (1 kalimat) untuk: "${input}". Buat sangat memancing rasa penasaran.`;
    case "idea":
      return lang === "en"
        ? `List 5 creative content ideas for: "${input}". Use numbered bullets.`
        : `Tulis 5 ide konten kreatif untuk: "${input}". Gunakan poin bernomor.`;
    case "hashtag":
      return lang === "en"
        ? `Generate up to 12 relevant hashtags for: "${input}". Lowercase, no numbering, separated by spaces.`
        : `Buat hingga 12 hashtag relevan untuk: "${input}". Huruf kecil semua, tanpa nomor, pisahkan dengan spasi.`;
  }
}

// Code Function
async function callOpenAI({
  tool,
  input,
  lang,
}: {
  tool: Tool;
  input: string;
  lang: Lang;
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await client.responses.create(
      {
        model: MODEL,
        instructions: sysPrompt(lang),
        input: userPrompt(tool, input, lang),
      },
      { signal: controller.signal }
    );

    const text = (response as any).output_text as string | undefined;
    if (!text) throw new AppError(502, "Empty response from OpenAI");

    return text.trim();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new AppError(504, "OpenAI request timeout");
    }
    const msg =
      err?.response?.data?.error?.message || err?.message || "OpenAI error";
    const status = err?.status || err?.response?.status;
    if (status && Number.isInteger(status)) throw new AppError(status, msg);
    throw new AppError(502, msg);
  } finally {
    clearTimeout(timer);
  }
}

// Main Export
export async function aiComplete(params: {
  tool: Tool;
  input: string;
  lang: Lang;
}) {
  const output = await callOpenAI(params);

  return {
    tool: params.tool,
    lang: params.lang,
    output,
    model: MODEL,
  };
}
