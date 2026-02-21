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
      const telegramChatIdFromMessage = message.chat.id;
      const telegramMessageText = message.text;
      const telegramMessageId = message.message_id;
      const timestamp = new Date(message.date * 1000);

      console.log(`Received Telegram message from chat ${telegramChatIdFromMessage}: ${telegramMessageText}`);

      let sessionId = 'default_session';

      const chatSessionsRef = db.collection('chatSessions');
      let q;
      if (telegramChatIdFromMessage) {
        q = chatSessionsRef.where('telegramChatId', '==', String(telegramChatIdFromMessage)).limit(1);
      } else {
        console.warn('No telegramChatId found in message. Using default session.');
      }

      if (q) {
        const snapshot = await q.get();
        if (!snapshot.empty) {
          sessionId = snapshot.docs[0].id;
          console.log(`Found existing session ${sessionId} for Telegram chat ID ${telegramChatIdFromMessage}`);
        } else {
          console.warn(`No existing session found for Telegram chat ID ${telegramChatIdFromMessage}. Using default session.`);
        }
      }
      console.log(`Using sessionId: ${sessionId} for Telegram reply.`);

      try {
        const chatMessageData: any = {
          sessionId: sessionId,
          text: telegramMessageText,
          sender: 'bot',
          timestamp: timestamp,
          telegramMessageId: telegramMessageId,
        };
        if (telegramChatIdFromMessage) {
          chatMessageData.telegramChatId = String(telegramChatIdFromMessage);
        }

        await db.collection('chatMessages').add(chatMessageData);
        console.log('Telegram reply saved to Firebase.');
        res.status(200).send('OK');
      } catch (error) {
        console.error('Error saving Telegram reply to Firebase:', error);
        res.status(500).send('Error saving message');
      }
    } else {
      console.log('Received non-message update from Telegram:', req.body);
      res.status(200).send('OK');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
