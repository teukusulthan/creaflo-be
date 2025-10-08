import { CompletionPayload } from "../types/ai.types";
import { aiComplete } from "../utils/aiCient";

export async function listTools() {
  return [
    { key: "caption", name: "Caption Generator", icon: "Megaphone" },
    { key: "hook", name: "Hook (Shorts Opener)", icon: "Lightbulb" },
    { key: "idea", name: "Idea Generator", icon: "ScrollText" },
    { key: "hashtag", name: "Hashtag Generator", icon: "Hash" },
  ];
}

export async function runCompletion(payload: CompletionPayload) {
  const result = await aiComplete(payload);
  return { result };
}
