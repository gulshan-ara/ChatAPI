// routes/messages.ts
import { Router, Request, Response } from "express";
import Message from "../models/Message";

const router = Router();

/**
 * @swagger
 * /api/messages/{sender}/{recipient}:
 *   get:
 *     summary: Get messages between two users
 *     description: Fetch all messages exchanged between the sender and recipient.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: sender
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sender.
 *       - in: path
 *         name: recipient
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipient.
 *     responses:
 *       200:
 *         description: A list of messages between the sender and recipient.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sender:
 *                     type: string
 *                     description: The ID of the message sender.
 *                   recipient:
 *                     type: string
 *                     description: The ID of the message recipient.
 *                   content:
 *                     type: string
 *                     description: The message content.
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: The time the message was sent.
 *       500:
 *         description: Server error while fetching messages.
 */
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
