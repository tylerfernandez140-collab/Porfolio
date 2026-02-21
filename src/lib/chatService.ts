import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";

export interface ChatMessage {
  id?: string;
  text: string;
  sender: "user" | "bot";
  timestamp: any;
  sessionId: string;
  telegramChatId?: string; // Added for Telegram integration
  telegramMessageId?: number; // Added for Telegram reply mapping
}

export interface ChatSession {
  id: string;
  createdAt: any;
  lastMessage: string;
  lastMessageTime: any;
  messageCount: number;
  telegramChatId?: string; // Added for Telegram integration
  nickname?: string; // Added for user nickname
}

// Generate or get session ID from localStorage
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', sessionId);
  }
  return sessionId;
};

// Save message to Firestore
export const saveMessage = async (text: string, sender: "user" | "bot", telegramChatId?: string, telegramMessageId?: number): Promise<void> => {
  try {
    const sessionId = getSessionId();
    
    const messagesRef = collection(db, "chatMessages");
    
    const messageData: any = {
      text,
      sender,
      sessionId,
      timestamp: serverTimestamp(),
    };

    if (telegramChatId) {
      messageData.telegramChatId = telegramChatId;
    }
    if (telegramMessageId) {
      messageData.telegramMessageId = telegramMessageId;
    }
    
    await addDoc(messagesRef, messageData);

    // Update session info, passing telegramChatId and telegramMessageId
    await updateSessionInfo(sessionId, text, telegramChatId, telegramMessageId);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

// Update session information
const updateSessionInfo = async (sessionId: string, lastMessage: string, telegramChatId?: string, telegramMessageId?: number): Promise<void> => {
  try {
    const sessionRef = doc(db, "chatSessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const updateData: any = {
        lastMessage,
        lastMessageTime: serverTimestamp(),
        messageCount: (sessionDoc.data()?.messageCount || 0) + 1
      };
      if (telegramChatId) {
        updateData.telegramChatId = telegramChatId;
      }
      if (telegramMessageId) {
        updateData.telegramMessageId = telegramMessageId;
      }
      await updateDoc(sessionRef, updateData);
    } else {
      const setData: any = {
        id: sessionId,
        createdAt: serverTimestamp(),
        lastMessage,
        lastMessageTime: serverTimestamp(),
        messageCount: 1
      };
      if (telegramChatId) {
        setData.telegramChatId = telegramChatId;
      }
      if (telegramMessageId) {
        setData.telegramMessageId = telegramMessageId;
      }
      await setDoc(sessionRef, setData);
    }
  } catch (error) {
    console.error("Error updating session:", error);
  }
};

// Get messages for current session
export const getMessages = (callback: (messages: ChatMessage[]) => void) => {
  const sessionId = getSessionId();
  
  const messagesRef = collection(db, "chatMessages");
  const q = query(
    messagesRef, 
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp,
        sessionId: data.sessionId,
        telegramChatId: data.telegramChatId, // Include telegramChatId when fetching
        telegramMessageId: data.telegramMessageId // Include telegramMessageId when fetching
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages:", error);
  });
};

// Get all chat sessions (for admin purposes)
export const getAllSessions = async () => {
  // This would be used for an admin dashboard
  // You can implement this later if needed
  return [];
};

// Clear current session
export const clearSession = (): void => {
  localStorage.removeItem('chatSessionId');
};

export const saveNickname = async (sessionId: string, nickname: string): Promise<void> => {
  try {
    const sessionRef = doc(db, "chatSessions", sessionId);
    await updateDoc(sessionRef, { nickname });
    console.log(`Nickname "${nickname}" saved for session ${sessionId}`);
  } catch (error) {
    console.error("Error saving nickname:", error);
  }
};
