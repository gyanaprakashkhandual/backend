import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const server = app.listen(PORT, () => {
  console.log(`Server: http://${HOST}:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default server;
