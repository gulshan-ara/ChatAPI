import express from "express";
import NotificationService from "../services/NotificationService";
import NotificationPreferences from "../services/NotificationPreference";

const router = express.Router();

/**
 * @swagger
 * /api/notifications/push:
 *   post:
 *     summary: Send a push notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to send the notification to.
 *               message:
 *                 type: string
 *                 description: The message to send.
 *     responses:
 *       200:
 *         description: Push notification sent successfully.
 *       500:
 *         description: Server error.
 */
router.post("/push", async (req, res) => {
  const { userId, message } = req.body;
  await NotificationService.sendPushNotification(userId, message);
  res.status(200).json({ message: "Push notification sent" });
});

/**
 * @swagger
 * /api/notifications/email:
 *   post:
 *     summary: Send an email notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to send the notification to.
 *               subject:
 *                 type: string
 *                 description: The subject of the email.
 *               body:
 *                 type: string
 *                 description: The body of the email.
 *     responses:
 *       200:
 *         description: Email notification sent successfully.
 *       500:
 *         description: Server error.
 */
router.post("/email", async (req, res) => {
  const { email, subject, body } = req.body;
  await NotificationService.sendEmailNotification(email, subject, body);
  res.status(200).json({ message: "Email notification sent" });
});

/**
 * @swagger
 * /api/notifications/sms:
 *   post:
 *     summary: Send an SMS notification (mock)
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number to send the notification to.
 *               message:
 *                 type: string
 *                 description: The message to send.
 *     responses:
 *       200:
 *         description: SMS notification sent successfully (mock).
 *       500:
 *         description: Server error.
 */
router.post("/sms", async (req, res) => {
  const { phoneNumber, message } = req.body;
  await NotificationService.sendSmsNotification(phoneNumber, message);
  res.status(200).json({ message: "SMS notification sent (mock)" });
});

/**
 * @swagger
 * /api/notifications/preferences/{userId}:
 *   get:
 *     summary: Get user notification preferences
 *     tags: [Notification Preferences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve preferences for.
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get("/preferences/:userId", async (req, res) => {
  const preferences = await NotificationPreferences.getUserPreferences(
    req.params.userId
  );
  res.status(200).json(preferences);
});

/**
 * @swagger
 * /api/notifications/preferences/{userId}:
 *   put:
 *     summary: Update user notification preferences
 *     tags: [Notification Preferences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update preferences for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 description: An object containing the notification preferences.
 *     responses:
 *       200:
 *         description: Preferences updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.put("/preferences/:userId", async (req, res) => {
  await NotificationPreferences.updateUserPreferences(
    req.params.userId,
    req.body
  );
  res.status(200).json({ message: "Preferences updated" });
});

export default router;
