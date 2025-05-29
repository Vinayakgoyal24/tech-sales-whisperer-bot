
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageBubble } from "./MessageBubble";
import { QuotationActions } from "./QuotationActions";
import { VoiceButton } from "./VoiceButton";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
}

interface ChatInterfaceProps {
  chatId: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your sales agent for computers and peripherals. I can help you find the perfect products, generate quotations, and answer any questions you have. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
        hasQuotation: inputValue.toLowerCase().includes("quotation") || inputValue.toLowerCase().includes("quote"),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("laptop") || input.includes("computer")) {
      return "I can help you with laptops and computers! We have a wide range of options including gaming laptops, business laptops, and desktop computers. What's your budget range and intended use?";
    } else if (input.includes("mouse") || input.includes("keyboard")) {
      return "Great choice! We offer various peripherals including wireless mice, mechanical keyboards, and gaming accessories. Are you looking for gaming or office peripherals?";
    } else if (input.includes("quotation") || input.includes("quote")) {
      return "I've prepared a quotation based on your requirements. You can download it as a PDF or PowerPoint presentation using the buttons below. The quotation includes detailed specifications and competitive pricing.";
    } else if (input.includes("price") || input.includes("cost")) {
      return "Our prices are very competitive! I can provide detailed pricing for any specific products. Would you like me to generate a formal quotation with current market rates?";
    } else {
      return "I understand your inquiry about computer and peripheral products. Could you please provide more specific details about what you're looking for? I can help with laptops, desktops, monitors, keyboards, mice, and other accessories.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm p-4 flex items-center gap-3">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Sales Agent</h2>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.hasQuotation && message.sender === "bot" && (
              <QuotationActions />
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="w-5 h-5" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-blue-200 bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about computers, peripherals, or request a quotation..."
              className="pr-12 border-blue-200 focus:border-blue-500"
            />
          </div>
          <VoiceButton />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
