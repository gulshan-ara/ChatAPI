// server.ts
import express, { Express, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupSocketIO } from "./socket";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import messagesRouter from "./routes/messages";
import notificationsRouter from './routes/notifications';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealTime Chat & Notification Service API',
      version: '1.0.0',
      description: 'API for realtime chat and managing notifications including push, email, and SMS.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Routes
app.use("/api/messages", messagesRouter);
app.use('/api/notifications', notificationsRouter);

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
