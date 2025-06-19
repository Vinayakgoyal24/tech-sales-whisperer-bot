import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageBubble } from "./MessageBubble";
import { QuotationActions } from "./QuotationActions";
import { VoiceButton } from "./VoiceButton";
import { Send, Bot, Home, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
  collectedInfo?: Record<string, string>;
}

interface ChatInterfaceProps {
  chatId: string;
  messages: Message[];
  onMessagesChange: (updatedMessages: Message[]) => void;
}

export function ChatInterface({ chatId, messages, onMessagesChange }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [collectedInfo, setCollectedInfo] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[][]>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sanitizeTextForSpeech = (text: string): string => {
    return text
      .replace(/[#*@&^%$<>]/g, "")   // Remove unwanted characters
      .replace(/[_\-]/g, " ")        // Replace underscores/hyphens with space
      .replace(/\s+/g, " ")          // Normalize whitespace
      .trim();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isSpeechEnabled) {
      // Stop any ongoing speech immediately when muted
      window.speechSynthesis.cancel();
      return;
    }

    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === "bot" && lastMessage.text.trim() !== "") {
      const sanitizedText = sanitizeTextForSpeech(lastMessage.text); // ✅
      const utterance = new SpeechSynthesisUtterance(sanitizedText);
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isSpeechEnabled]);


  const updateMessages = (newMessages: Message[]) => {
    onMessagesChange(newMessages);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedUserMessages = [...messages, userMessage];
    updateMessages(updatedUserMessages);

    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const requestBody = {
        question: currentInput,
        step: step,
        collected_info: collectedInfo,
      };

      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I apologize, but I couldn't process your request at the moment.",
        sender: "bot",
        timestamp: new Date(),
        hasQuotation: data.has_quotation || false,
        collectedInfo: data.collected_info || {},
      };

      const updatedBotMessages = [...updatedUserMessages, botResponse];
      updateMessages(updatedBotMessages);

      if (data.step) setStep(data.step);
      if (data.collected_info) setCollectedInfo(data.collected_info);
      if (data.done) {
        setStep(null);
        setCollectedInfo({});
      }
    } catch (error) {
      console.error("Query error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm sorry, I'm having trouble connecting to the server right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };

      updateMessages([...messages, errorMsg]);
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

  const handleRestartSession = () => {
    if (messages.length > 1) {
      setHistory((prev) => [...prev, messages]);
    }

    const welcome: Message = {
      id: "welcome",
      text: "Hello! I'm your sales agent for computers and peripherals. I can help you find the perfect products, generate quotations, and answer any questions you have. Can I please know your name?",
      sender: "bot",
      timestamp: new Date(),
    };

    updateMessages([welcome]);
    setInputValue("");
    setStep(null);
    setCollectedInfo({});
  };

  const toggleSpeech = () => {
    if (isSpeechEnabled) {
      // Immediately stop ongoing speech when muting
      window.speechSynthesis.cancel();
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  return (
    <div className="flex flex-col h-screen">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.hasQuotation && message.sender === "bot" && (
              <QuotationActions
                quotationText={message.text}
                clientInfo={message.collectedInfo || {}}
              />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="w-5 h-5" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-blue-200 bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto items-center">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about computers, peripherals, or request a quotation..."
              className="pr-12 border-blue-200 focus:border-blue-500"
              disabled={isTyping}
            />
          </div>

          {/* Mute/Unmute Button near input */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSpeech}
            className={`transition-colors ${
              isSpeechEnabled
                ? "border-blue-400 hover:bg-blue-100 text-blue-600"
                : "bg-red-100 border-red-300 text-red-700 animate-pulse"
            }`}
            aria-label={isSpeechEnabled ? "Mute Speech" : "Unmute Speech"}
            title={isSpeechEnabled ? "Mute bot speech" : "Unmute bot speech"}
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleRestartSession}
            className="text-blue-600 border-blue-400 hover:bg-blue-100"
          >
            <Home className="w-4 h-4 mr-1" /> Home
          </Button>

          <VoiceButton setInputText={setInputValue} />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
