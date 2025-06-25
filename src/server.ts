import type { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected successfully");

    server = app.listen(config.port || 3000, () => {
      console.log(`App is listening on port ${config.port || 3000}`);
    });
  } catch (err) {
    console.log("Database connection error:", err);
  }
}

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  main();
}

process.on("unhandledRejection", (reason) => {
  console.log("unhandledRejection is detected:", reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncaughtException is detected:", error);
  process.exit(1);
});

// For Vercel serverless functions, we need to handle the database connection differently
if (process.env.VERCEL) {
  // Connect to database when the module is loaded
  mongoose.connect(config.database_url as string).catch(console.error);
}

// Export the Express app for Vercel
export default app;
