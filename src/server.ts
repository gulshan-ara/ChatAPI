// server.ts
import express, { Express, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupSocketIO } from "./socket";
import messagesRouter from "./routes/messages";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Routes
app.use("/api/messages", messagesRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
setupSocketIO(server);

// Start the server
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
