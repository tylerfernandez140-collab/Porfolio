import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatBadgeProps {
  senderType?: "human" | "ai";
  source?: "telegram" | "web" | "ai";
}

const ChatBadge: React.FC<ChatBadgeProps> = ({ senderType, source }) => {
  if (senderType === "human" && source === "telegram") {
    return (
      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        via Telegram
      </span>
    );

  }
  return null;
};

export default ChatBadge;
