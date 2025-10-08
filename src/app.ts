import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import historyRoute from "./routes/history.routes";
import { authenticate } from "./middlewares/auth";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(cookieParser());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/ai", authenticate, aiRoutes);
app.use("/api/v1", authenticate, historyRoute);

app.use(errorHandler);

export default app;
