import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { useTheme } from "next-themes";
import lightMain from "../assets/light-main.png";
import darkMain from "../assets/dark-main.png";
import { saveMessage, getMessages, ChatMessage, saveNickname, getSessionId } from "../lib/chatService";
import TelegramService from "../lib/TelegramServiceModule";
import { db } from "../lib/firebase"; // Import db
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import ChatBadge from "./ChatBadge"; // Import the new ChatBadge component

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sender_name?: string;
  sender_type?: "human" | "ai";
  source?: "telegram" | "web" | "ai";
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameInput, setShowNicknameInput] = useState(false);
  const [isAITakingOver, setIsAITakingOver] = useState(true);
  const [humanModeStarted, setHumanModeStarted] = useState(false);
  const [lastSenderType, setLastSenderType] = useState<"visitor" | "human" | null>(null);
  const [aiTakeoverStarted, setAiTakeoverStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const telegramService = new TelegramService();

  // Load messages from Firebase when component mounts
  useEffect(() => {
    if (isOpen) {
      const synchronizeSession = async () => {
        const telegramChatId = telegramService.chatId;
        if (telegramChatId) {
          const q = query(collection(db, "chatSessions"), where("telegramChatId", "==", telegramChatId));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const firebaseSessionId = querySnapshot.docs[0].id;
            const currentLocalSessionId = localStorage.getItem('chatSessionId');

            if (currentLocalSessionId !== firebaseSessionId) {
              localStorage.setItem('chatSessionId', firebaseSessionId);
            }
          }
        }
      };

      synchronizeSession();

      const storedNickname = localStorage.getItem('chatNickname');
      if (storedNickname) {
        setNickname(storedNickname);
        setShowNicknameInput(false);
      } else {
        setShowNicknameInput(true);
      }

      const ensureWelcomeMessage = async () => {
    const currentSessionId = getSessionId();
    if (!currentSessionId) {
      return;
    }

    const messagesRef = collection(db, "chatSessions", currentSessionId, "chatMessages");
    const q = query(
      messagesRef,
      where("sender", "==", "bot"),
      where("sender_type", "==", "ai"),
      where("source", "==", "ai"),
      where("text", "==", "Hi there! 👋🏻 I'm Ivan.\n\nThanks for checking out my website! How can I help you today?")
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hi there! 👋🏻 I'm Ivan.\n\nThanks for checking out my website! How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
        sender_name: "",
        sender_type: "ai",
        source: "ai",
      };
      await saveMessage(welcomeMessage.text, "bot", "", "ai", "ai");
    }
  };

      ensureWelcomeMessage();

      const unsubscribe = getMessages((firebaseMessages: ChatMessage[]) => {
        // Convert Firebase messages to local format
        const convertedMessages: Message[] = firebaseMessages.map(msg => ({
          id: msg.id || '',
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          sender_name: msg.sender_name,
          sender_type: msg.sender_type,
          source: msg.source,
        }));
        setMessages(convertedMessages);

        const last = convertedMessages[convertedMessages.length - 1];

        if (!last) return;

        if (last.sender_type === "human" && last.source === "telegram") {
          setLastSenderType("human");
          setIsAITakingOver(false); // Ivan is online, AI should not take over
          setAiTakeoverStarted(false); // Reset takeover flag when human replies
        } else if (last.sender === "user" && last.source === "web") {
          setLastSenderType("visitor");
          setIsAITakingOver(true); // Web visitor, AI can take over if timer triggers
          setAiTakeoverStarted(false); // Reset takeover flag when visitor sends message
        }

        // Find the last message from Ivan (specifically via Telegram)
        const hasHumanReply = convertedMessages.some(
          (msg) => msg.sender_type === "human" && msg.source === "telegram"
        );

        if (hasHumanReply) {
          setHumanModeStarted(true);
        }
      });

      return () => unsubscribe();
    }
  }, [isOpen, telegramService.chatId]);

  useEffect(() => {
    if (!humanModeStarted) return;
    if (!lastSenderType) return;

    const visitorOfflineText =
      "Ivan is now offline. I'm here to help you with any questions about his portfolio or services. How can I assist you today?";

    const humanAwayText =
      "Looks like you're away. You can chat here again anytime if you need help.";

    const timer = setTimeout(async () => {
      if (!aiTakeoverStarted) {
        setAiTakeoverStarted(true);
        const takeoverMessageText =
          lastSenderType === "visitor"
            ? visitorOfflineText
            : humanAwayText;

        await saveMessage(
          takeoverMessageText,
          "bot",
          "",
          "ai",
          "ai"
        );

        setIsAITakingOver(true);
      }
    }, 60 * 1000);

    return () => clearTimeout(timer);
  }, [humanModeStarted, lastSenderType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(
        `/api/gemini`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok && data.error) {
        // If the response is not OK and contains a custom error message
        return data.error;
      } else if (data.response) {
        return data.response;
      } else {
        return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, I'm experiencing some technical difficulties. Please try again later or contact Ivan directly at fernandezivan140@gmail.com";
    }
  };

  const handleStartChat = async () => {
    if (nickname) {
      localStorage.setItem('chatNickname', nickname);
      setShowNicknameInput(false);
      await saveNickname(getSessionId(), nickname);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      sender_name: "You", // Always display "You" for user messages
      sender_type: "human",
      source: "web",
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Save user message to Firebase, ensuring sender_name is the nickname
    const senderName = nickname || "You"; // Use nickname if available, otherwise "You"
    const telegramMessageId = await telegramService.sendToTelegram(inputValue, senderName);
    await saveMessage(inputValue, "user", senderName, "human", "web", telegramService.chatId, telegramMessageId);

    if (isAITakingOver) {
      try {
        const botResponse = await generateResponse(inputValue);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
          sender_name: "",
          sender_type: "ai",
          source: "ai",
        };
        setMessages(prev => [...prev, botMessage]);
        
        // Save bot response to Firebase
        await saveMessage(botResponse, "bot", "", "ai", "ai", telegramService.chatId);
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsTyping(false);
      }
    } else {
      setIsTyping(false); // If AI is not taking over, stop typing indicator immediately
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-6 py-4 bg-foreground text-background rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Chat with Ivan</span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 
      ${isMinimized 
        ? "w-80 h-14 bottom-20 right-6" 
        : "w-72 h-[200px] bottom-96 right-6 sm:w-96 sm:h-[500px] sm:bottom-20 sm:right-6"
      }`}
      style={{
        boxShadow: theme === "dark" 
          ? '0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)'
          : '0 0 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1), 0 0 30px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={theme === "dark" ? darkMain : lightMain}
              alt="Ivan Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Chat with Ivan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">ONLINE</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isMinimized && (
        <>
          {showNicknameInput ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 h-[380px] bg-gray-50 dark:bg-gray-800">
              <p className="text-lg text-center mb-4">Before we start, what should I call you?</p>
              <input
                type="text"
                value={nickname || ''}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
              />
              <button
                onClick={handleStartChat}
                disabled={!nickname || nickname.trim() === ''}
                className="w-full p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                Start Chat
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 h-[380px] bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                    {messages.map((message) => {
                      return (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === "user" && message.source === "web" ? "items-end" : "items-start"}`}
              >
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                            {message.sender_type === "human" && message.source === "telegram" && <User className="w-5 h-5 mr-1" />}
                            {message.sender === "bot" && <Bot className="w-5 h-5 mr-1" />}
                            {message.sender_type === "human" && message.source === "telegram" ? "Ivan" : (message.sender_name || (message.sender === "user" ? "You" : ""))}
                          </span>
                          {message.sender_type === "human" && message.source === "telegram" && (
                            <ChatBadge senderType={message.sender_type} source={message.source} />
                          )}
                        </div>
                        <div
                          className={`max-w-[70%] px-4 py-3 rounded-2xl border ${
                            message.sender_type === "human"
                              ? "bg-white text-gray-800 dark:bg-green-700 dark:text-white border-gray-300 dark:border-green-600 rounded-br-sm"
                              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        </div>
                      </div>
                    );})}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-300 dark:border-gray-600">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || inputValue.trim() === ""}
                    className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AIChatBot;