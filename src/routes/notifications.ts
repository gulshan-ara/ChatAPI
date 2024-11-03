import express from 'express';
import NotificationService from '../services/NotificationService';
import NotificationPreferences from '../services/NotificationPreference';

const router = express.Router();

router.post('/push', async (req, res) => {
  const { userId, message } = req.body;
  await NotificationService.sendPushNotification(userId, message);
  res.status(200).json({ message: 'Push notification sent' });
});

router.post('/email', async (req, res) => {
  const { email, subject, body } = req.body;
  await NotificationService.sendEmailNotification(email, subject, body);
  res.status(200).json({ message: 'Email notification sent' });
});

router.post('/sms', async (req, res) => {
  const { phoneNumber, message } = req.body;
  await NotificationService.sendSmsNotification(phoneNumber, message);
  res.status(200).json({ message: 'SMS notification sent (mock)' });
});

router.get('/preferences/:userId', async (req, res) => {
  const preferences = await NotificationPreferences.getUserPreferences(req.params.userId);
  res.status(200).json(preferences);
});

router.put('/preferences/:userId', async (req, res) => {
  await NotificationPreferences.updateUserPreferences(req.params.userId, req.body);
  res.status(200).json({ message: 'Preferences updated' });
});

export default router;
