import app from "./app.js";
import { env } from "./config/env.js";

// Fallback in case PORT is missing or misconfigured
const PORT = Number(env.PORT) || 3001;

const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (${env.NODE_ENV})`);
});

// Graceful shutdown (recommended)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export default server;
