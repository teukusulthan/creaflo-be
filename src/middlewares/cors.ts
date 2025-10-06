import cors from "cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:8080"],
  credentials: true,
});
