import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
  collectedInfo?: Record<string, string>;
}

interface ChatHistoryProps {
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  allChats: Record<string, Message[]>;
  setAllChats: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  setCurrentChatId: (chatId: string) => void;
}

export function ChatHistory({
  currentChatId,
  onChatSelect,
  allChats,
  setAllChats,
  setCurrentChatId,
}: ChatHistoryProps) {
  const { toast } = useToast();

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllChats((prev) => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });

    toast({
      title: "Chat Deleted",
      description: "Chat history has been removed.",
    });

    if (chatId === currentChatId) {
      setCurrentChatId("default");
    }
  };

  const chats = Object.entries(allChats).map(([id, messages]) => {
    const lastMsg = messages[messages.length - 1];
    const title =
      messages.find((msg) => msg.sender === "user")?.text.slice(0, 30) ||
      "New Chat";
    return {
      id,
      title: id === "default" ? "Current Chat" : title,
      date:
        lastMsg && lastMsg.timestamp
          ? new Date(lastMsg.timestamp).toLocaleDateString()
          : "Unknown",
    };
  });

  return (
    <Card className="p-4 border-blue-200">
      <h3 className="font-medium text-gray-900 mb-3">Previous Chats</h3>

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              chat.id === currentChatId
                ? "bg-blue-100 border-blue-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500">{chat.date}</p>
                </div>
              </div>
              {chat.id !== "default" && (
                <Button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
