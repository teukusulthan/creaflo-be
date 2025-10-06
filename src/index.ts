import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
