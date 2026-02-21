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
  where,
  writeBatch,
  getDocs
} from "firebase/firestore";

export interface ChatMessage {
  id?: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sessionId: string;
  telegramChatId?: string; // Added for Telegram integration
  telegramMessageId?: number; // Added for Telegram reply mapping
  sender_name?: string; // New field for sender's display name
  sender_type?: "human" | "ai"; // New field: "human" or "ai"
  source?: "telegram" | "web" | "ai"; // New field: "telegram", "web", or "ai"
  isWelcomeMessage?: boolean; // New field to identify welcome messages
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
export const saveMessage = async (
  text: string, 
  sender: "user" | "bot", 
  sender_name: string, // New parameter
  sender_type: "human" | "ai", // New parameter
  source: "telegram" | "web" | "ai", // New parameter
  telegramChatId?: string, 
  telegramMessageId?: number,
  isWelcomeMessage?: boolean // New parameter
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    
    const messagesRef = collection(db, "chatMessages");
    
    const messageData: any = {
      text,
      sender,
      sessionId,
      timestamp: serverTimestamp(),
      sender_name, // Store new field
      sender_type, // Store new field
      source, // Store new field
    };

    if (telegramChatId) {
      messageData.telegramChatId = telegramChatId;
    }
    if (telegramMessageId) {
      messageData.telegramMessageId = telegramMessageId;
    }
    if (isWelcomeMessage) { // Store new field if true
      messageData.isWelcomeMessage = isWelcomeMessage;
    }
    
    await addDoc(messagesRef, messageData);

    // Update session info, passing telegramChatId and telegramMessageId
    await updateSessionInfo(sessionId, text, sender_name, sender_type, source, telegramChatId, telegramMessageId);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

// Update session information
const updateSessionInfo = async (
  sessionId: string, 
  lastMessage: string, 
  sender_name: string, // New parameter
  sender_type: "human" | "ai", // New parameter
  source: "telegram" | "web" | "ai", // New parameter
  telegramChatId?: string, 
  telegramMessageId?: number
): Promise<void> => {
  try {
    const sessionRef = doc(db, "chatSessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const updateData: any = {
        lastMessage,
        lastMessageTime: serverTimestamp(),
        messageCount: (sessionDoc.data()?.messageCount || 0) + 1,
        lastSenderName: sender_name, // Store new field
        lastSenderType: sender_type, // Store new field
        lastSource: source, // Store new field
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
        messageCount: 1,
        lastSenderName: sender_name, // Store new field
        lastSenderType: sender_type, // Store new field
        lastSource: source, // Store new field
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
        telegramMessageId: data.telegramMessageId, // Include telegramMessageId when fetching
        sender_name: data.sender_name, // Include new field
        sender_type: data.sender_type, // Include new field
        source: data.source, // Include new field
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

    // Retroactively update sender_name for previous messages in this session
    const messagesRef = collection(db, "chatMessages");
    const q = query(
      messagesRef,
      where("sessionId", "==", sessionId),
      where("sender", "==", "user"),
      where("sender_name", "==", "You") // Target messages sent as "You"
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((messageDoc) => {
        batch.update(messageDoc.ref, { sender_name: nickname });
      });
      await batch.commit();
      console.log(`Updated sender_name for ${querySnapshot.size} messages in session ${sessionId}`);
    }
  } catch (error) {
    console.error("Error saving nickname:", error);
  }
};
