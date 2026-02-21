import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = getFirestore();

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (message && message.text) {
      const telegramChatId = message.chat.id;
      const telegramMessageText = message.text;
      const telegramMessageId = message.message_id;
      const timestamp = new Date(message.date * 1000); // Telegram timestamp is in seconds

      console.log(`Received Telegram message from chat ${telegramChatId}: ${telegramMessageText}`);

      let sessionId = 'default_session'; // Declare sessionId here

      // Find the chat session associated with this Telegram chat ID
      const chatSessionsRef = db.collection('chatSessions');
      const q = chatSessionsRef.where('telegramChatId', '==', telegramChatId).limit(1);
      const snapshot = await q.get();

      if (!snapshot.empty) {
        sessionId = snapshot.docs[0].id;
        console.log(`Found existing session ${sessionId} for Telegram chat ID ${telegramChatId}`);
      } else {
        console.warn(`No existing session found for Telegram chat ID ${telegramChatId}. Using default session.`);
      }
      console.log(`Using sessionId: ${sessionId} for Telegram reply.`);

      try {
        await db.collection('chatMessages').add({
          sessionId: sessionId,
          text: telegramMessageText,
          sender: 'bot', // Telegram replies are from the bot's perspective to the user
          timestamp: timestamp,
          telegramMessageId: telegramMessageId, // Store Telegram's message ID for reference
          telegramChatId: telegramChatId, // Store Telegram's chat ID for future mapping
        });
        console.log('Telegram reply saved to Firebase.');
        res.status(200).send('OK');
      } catch (error) {
        console.error('Error saving Telegram reply to Firebase:', error);
        res.status(500).send('Error saving message');
      }
    } else {
      console.log('Received non-message update from Telegram:', req.body);
      res.status(200).send('OK'); // Acknowledge other updates
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
