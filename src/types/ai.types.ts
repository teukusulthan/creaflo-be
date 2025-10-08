export type AiTool = "caption" | "hook" | "idea" | "hashtag";
export type Lang = "id" | "en";

export type CompletionPayload = {
  tool: AiTool;
  input: string;
  lang: Lang;
};
