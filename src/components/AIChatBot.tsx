import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useTheme } from "next-themes";
import lightMain from "../assets/light-main.png";
import darkMain from "../assets/dark-main.png";
import { saveMessage, getMessages, ChatMessage } from "../lib/chatService";
import TelegramService from "../lib/telegramService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: any;
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const telegramService = new TelegramService();

  // Load messages from Firebase when component mounts
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = getMessages((firebaseMessages: ChatMessage[]) => {
        // Convert Firebase messages to local format
        const convertedMessages: Message[] = firebaseMessages.map(msg => ({
          id: msg.id || '',
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp
        }));

        // If no messages, add and save welcome message
        if (convertedMessages.length === 0) {
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            text: "Hi there! 👋🏻 I'm Ivan.\n\nThanks for checking out my website! How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
          // Save welcome message to Firebase
          saveMessage(welcomeMessage.text, "bot");
        } else {
          setMessages(convertedMessages);
        }
      });

      return () => unsubscribe();
    }
  }, [isOpen]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/gemini`,
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
      
      if (data.response) {
        return data.response;
      } else {
        return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, I'm experiencing some technical difficulties. Please try again later or contact Ivan directly at fernandezivan140@gmail.com";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Save user message to Firebase, including telegramChatId
    await saveMessage(inputValue, "user", telegramService.chatId);

    // Send message to your Telegram
    await telegramService.sendToTelegram(inputValue);

    try {
      const botResponse = await generateResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot response to Firebase
      await saveMessage(botResponse, "bot", telegramService.chatId);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
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
      className={`fixed bottom-20 right-6 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isMinimized ? "w-80 h-14" : "w-96 h-[500px]"
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
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-[380px] bg-gray-50 dark:bg-gray-800">
            <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 ${
                        message.sender === "user"
                          ? "bg-black dark:bg-white text-white dark:text-black rounded-br-sm"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default AIChatBot;
