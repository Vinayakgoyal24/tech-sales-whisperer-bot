import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <Card className={`max-w-md p-3 ${
        isBot 
          ? "bg-white border-blue-200" 
          : "bg-blue-600 text-white border-blue-600"
      }`}>
        {/* ✅ Don't render text if it's a quotation */}
        {!message.hasQuotation && (
          <p className="text-sm leading-relaxed">{message.text}</p>
        )}

        {/* Always show the timestamp */}
        <p className={`text-xs mt-2 ${
          isBot ? "text-gray-500" : "text-blue-100"
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </Card>

      {!isBot && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
