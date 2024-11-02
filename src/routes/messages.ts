// routes/messages.ts
import { Router, Request, Response } from "express";
import Message from "../models/Message";

const router = Router();

router.get("/:sender/:recipient", async (req: Request, res: Response) => {
  const { sender, recipient } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
