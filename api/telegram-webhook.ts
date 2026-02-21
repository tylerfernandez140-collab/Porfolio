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

      let telegramUserName = message.from.first_name || message.from.username || `Telegram User ${telegramChatIdFromMessage}`;
      if (message.from.last_name) {
        telegramUserName += ` ${message.from.last_name}`;
      }

      let sessionId: string | undefined; // Declare sessionId as possibly undefined
      const chatSessionsRef = db.collection('chatSessions');
      const chatMessagesRef = db.collection('chatMessages'); // New: Reference to chatMessages

      // Check if this is a reply to a previous message from the bot
      if (message.reply_to_message && message.reply_to_message.message_id) {
        const repliedToMessageId = message.reply_to_message.message_id;
        console.log(`Received a reply to Telegram message ID: ${repliedToMessageId}`);

        // Try to find the session associated with the replied-to message
        const q = chatMessagesRef.where('telegramMessageId', '==', repliedToMessageId).limit(1);
        const repliedToMessageSnapshot = await q.get();

        if (!repliedToMessageSnapshot.empty) {
          sessionId = repliedToMessageSnapshot.docs[0].data().sessionId;
          console.log(`Found session ${sessionId} for replied-to Telegram message ID ${repliedToMessageId}`);
        } else {
          console.warn(`No session found for replied-to Telegram message ID ${repliedToMessageId}. Proceeding with new session linking logic.`);
        }
      }

      // If sessionId is still not set (meaning it wasn't a reply to an existing message),
      // try to find an existing session linked by telegramChatId
      if (!sessionId && telegramChatIdFromMessage) {
        const q = chatSessionsRef.where('telegramChatId', '==', String(telegramChatIdFromMessage)).limit(1);
        console.log(`Firestore query for telegramChatId: ${telegramChatIdFromMessage}`);
        const existingSessionSnapshot = await q.get();

        if (!existingSessionSnapshot.empty) {
          sessionId = existingSessionSnapshot.docs[0].id;
          console.log(`Found existing session ${sessionId} for Telegram chat ID ${telegramChatIdFromMessage}`);
        } else {
          console.warn(`No existing session found for Telegram chat ID ${telegramChatIdFromMessage}. Proceeding to link unlinked sessions or create new.`);
        }
      }

      // If sessionId is still not set, try to link to the most recent unlinked web chat session
      if (!sessionId) {
        console.warn(`No session found for Telegram chat ID ${telegramChatIdFromMessage}. Attempting to link to an unlinked web session or create a new one.`);

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
            await chatSessionsRef.doc(sessionId).update({ 
              telegramChatId: String(telegramChatIdFromMessage),
              nickname: telegramUserName, // Update nickname when linking
              lastSenderName: telegramUserName,
              lastSenderType: "human",
              lastSource: "telegram",
            });
            console.log(`Linked new Telegram chat ID ${telegramChatIdFromMessage} to existing session ${sessionId}`);
            foundUnlinkedSession = true;
        }

        if (!foundUnlinkedSession) {
            // If no unlinked session found, create a new session
            const newSessionRef = chatSessionsRef.doc(); // Let Firestore generate a new ID
            sessionId = newSessionRef.id;
            await newSessionRef.set({
                createdAt: timestamp,
                lastMessage: telegramMessageText,
                lastMessageTime: timestamp,
                messageCount: 1,
                telegramChatId: String(telegramChatIdFromMessage),
                nickname: telegramUserName, // Use actual Telegram user name
                lastSenderName: telegramUserName,
                lastSenderType: "human",
                lastSource: "telegram",
            });
            console.log(`Created new session ${sessionId} for Telegram chat ID ${telegramChatIdFromMessage}`);
        }
      }
      console.log(`Using sessionId: ${sessionId} for Telegram reply.`);

      if (!sessionId) {
        console.error('Session ID is undefined after all linking attempts.');
        return res.status(500).send('Error: Session ID could not be determined.');
      }

      try {
        const chatMessageData: any = {
          sessionId: sessionId,
          text: telegramMessageText,
          sender: 'user', // Telegram messages are from a user
          timestamp: timestamp,
          telegramMessageId: telegramMessageId,
          sender_name: telegramUserName,
          sender_type: "human",
          source: "telegram",
        };
        if (telegramChatIdFromMessage) {
          chatMessageData.telegramChatId = String(telegramChatIdFromMessage);
        }
        console.log('Saving chat message data to Firebase:', chatMessageData);

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
