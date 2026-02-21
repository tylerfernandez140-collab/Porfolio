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
      console.log(`Telegram Chat ID from message: ${telegramChatIdFromMessage}`);

      let sessionId = 'default_session';

      const chatSessionsRef = db.collection('chatSessions');
      let existingSessionSnapshot; // Declare snapshot here

      if (telegramChatIdFromMessage) {
        const q = chatSessionsRef.where('telegramChatId', '==', String(telegramChatIdFromMessage)).limit(1);
        console.log(`Firestore query for telegramChatId: ${telegramChatIdFromMessage}`);
        existingSessionSnapshot = await q.get(); // Execute query and assign to existingSessionSnapshot
      } else {
        console.warn('No telegramChatId found in message. Proceeding to link unlinked sessions or use default.');
      }

      if (existingSessionSnapshot && !existingSessionSnapshot.empty) { // Use existingSessionSnapshot here
        sessionId = existingSessionSnapshot.docs[0].id;
        console.log(`Found existing session ${sessionId} for Telegram chat ID ${telegramChatIdFromMessage}`);
      } else {
        // If no existing session found, try to link to the most recent unlinked web chat session
        console.warn(`No existing session found for Telegram chat ID ${telegramChatIdFromMessage}. Attempting to link to an unlinked web session.`);

        // Query for sessions that do NOT have a telegramChatId, ordered by lastMessageTime
        const unlinkedSessionsQuery = chatSessionsRef
            .where('telegramChatId', '==', null) // Assuming telegramChatId is explicitly null if unlinked
            .orderBy('lastMessageTime', 'desc')
            .limit(1);

        const unlinkedSnapshot = await unlinkedSessionsQuery.get();
        let foundUnlinkedSession = false;

        if (!unlinkedSnapshot.empty) {
            const doc = unlinkedSnapshot.docs[0];
            sessionId = doc.id;
            await chatSessionsRef.doc(sessionId).update({ telegramChatId: String(telegramChatIdFromMessage) });
            console.log(`Linked new Telegram chat ID ${telegramChatIdFromMessage} to existing session ${sessionId}`);
            foundUnlinkedSession = true;
        }

        if (!foundUnlinkedSession) {
            console.warn('No unlinked web session found to attach Telegram chat ID. Using default session.');
            sessionId = 'default_session'; // Fallback if no unlinked session found
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
        console.log('Saving chat message data to Firebase:', chatMessageData);

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
