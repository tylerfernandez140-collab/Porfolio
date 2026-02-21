import 'dotenv/config'; // Load environment variables from .env file

import TelegramService from '../src/lib/TelegramServiceModule.js';

console.log('Environment variables loaded.');

const setWebhook = async () => {
  console.log('Attempting to instantiate TelegramService...');
  const telegramService = new TelegramService();
  console.log('TelegramService instantiated.');
  const webhookUrl = 'https://ivandevph.vercel.app/api/telegram-webhook'; // Your Vercel deployment URL

  console.log(`Attempting to set Telegram webhook to: ${webhookUrl}`);
  await telegramService.setWebhook(webhookUrl);
  console.log('Webhook setup attempt complete.');
};

console.log('Calling setWebhook function...');
setWebhook().catch(error => {
  console.error('Error in setWebhook execution:', error);
  process.exit(1);
});
console.log('setWebhook function called.');
