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

  // New: state for language selection
  const [language, setLanguage] = useState<"en-US" | "ja-JP">("en-US");

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

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPhone = (phone: string) => {
    const re = /^\d{10}$/; // adjust regex as needed
    return re.test(phone);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Updated: Multilingual speech synthesis based on bot message language
  useEffect(() => {
    if (!isSpeechEnabled) {
      window.speechSynthesis.cancel();
      return;
    }

    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === "bot" && lastMessage.text.trim() !== "") {
      const sanitizedText = sanitizeTextForSpeech(lastMessage.text);

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(sanitizedText);

      // Detect Japanese chars to decide voice/lang
      const hasJapanese = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(sanitizedText);

      if (hasJapanese || language === "ja-JP") {
        utterance.lang = "ja-JP";
        const voices = window.speechSynthesis.getVoices();
        const jpVoice = voices.find((v) => v.lang.startsWith("ja"));
        if (jpVoice) utterance.voice = jpVoice;
      } else {
        utterance.lang = "en-US";
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find((v) => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isSpeechEnabled, language]);

  const updateMessages = (newMessages: Message[]) => {
    onMessagesChange(newMessages);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (step === "email" && !isValidEmail(inputValue.trim())) {
      toast({
        title: language === "ja-JP" ? "無効なメール" : "Invalid Email",
        description: language === "ja-JP"
          ? "有効なメールアドレスを入力してください。"
          : "Please enter a valid email address.",
        variant: "destructive",
      });
      setInputValue("");
      return;
    }

    if (step === "contact" && !isValidPhone(inputValue.trim())) {
      toast({
        title: language === "ja-JP" ? "無効な電話番号" : "Invalid Phone Number",
        description: language === "ja-JP"
          ? "有効な電話番号を入力してください。"
          : "Please enter a valid phone number.",
        variant: "destructive",
      });
      setInputValue("");
      return;
    }

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
        step,
        collected_info: collectedInfo,
        language, // you can pass language to backend if needed
      };

      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data.response ||
          (language === "ja-JP"
            ? "申し訳ありませんが、現在リクエストを処理できません。"
            : "I apologize, but I couldn't process your request at the moment."),
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
        // setCollectedInfo({}); // optionally reset info
      }
    } catch (error) {
      console.error("Query error:", error);
      toast({
        title: language === "ja-JP" ? "接続エラー" : "Connection Error",
        description: language === "ja-JP"
          ? "サーバーに接続できません。後でもう一度お試しください。"
          : "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: language === "ja-JP"
          ? "申し訳ありません。現在サーバーに接続できません。しばらくしてから再度お試しください。"
          : "I'm sorry, I'm having trouble connecting to the server right now. Please try again in a moment.",
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

    const welcomeMessage: Message = {
      id: "welcome",
      text:
        language === "ja-JP"
          ? "こんにちは！コンピュータや周辺機器の営業担当です。製品についてご質問ください。"
          : "Hello! I'm your sales agent for computers and peripherals. I can help you find the perfect products, generate quotations, and answer any questions you have. Can I please know your name?",
      sender: "bot",
      timestamp: new Date(),
    };

    updateMessages([welcomeMessage]);
    setInputValue("");
    setStep(null);
    setCollectedInfo({});
  };

  const toggleSpeech = () => {
    if (isSpeechEnabled) {
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
            <p className="text-sm text-green-600">{language === "ja-JP" ? "オンライン" : "Online"}</p>
          </div>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en-US" | "ja-JP")}
          className="ml-auto border border-gray-300 rounded px-2 py-1 text-sm"
          aria-label="Select Language"
          title="Select Language"
        >
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>
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
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
              placeholder={
                language === "ja-JP"
                  ? "コンピュータ、周辺機器について質問してください..."
                  : "Ask about computers, peripherals, or request a quotation..."
              }
              className="pr-12 border-blue-200 focus:border-blue-500"
              disabled={isTyping}
            />
          </div>

          {/* Mute/Unmute Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSpeech}
            className={`transition-colors ${
              isSpeechEnabled
                ? "border-blue-400 hover:bg-blue-100 text-blue-600"
                : "bg-red-100 border-red-300 text-red-700 animate-pulse"
            }`}
            aria-label={isSpeechEnabled ? (language === "ja-JP" ? "音声ミュート" : "Mute Speech") : (language === "ja-JP" ? "音声ミュート解除" : "Unmute Speech")}
            title={isSpeechEnabled ? (language === "ja-JP" ? "音声ミュート" : "Mute Speech") : (language === "ja-JP" ? "音声ミュート解除" : "Unmute Speech")}
          >
            {isSpeechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Button
            variant="outline"
            onClick={handleRestartSession}
            className="text-blue-600 border-blue-400 hover:bg-blue-100"
            title={language === "ja-JP" ? "ホームに戻る" : "Go Home"}
          >
            <Home className="w-4 h-4 mr-1" />
            {language === "ja-JP" ? "ホーム" : "Home"}
          </Button>

          {/* Pass language prop to VoiceButton */}
          <VoiceButton setInputText={setInputValue} lang={language} />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
            title={language === "ja-JP" ? "送信" : "Send"}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
