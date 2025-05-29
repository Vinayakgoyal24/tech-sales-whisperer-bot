
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatHistoryProps {
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
}

export function ChatHistory({ currentChatId, onChatSelect }: ChatHistoryProps) {
  const { toast } = useToast();

  const mockChats = [
    { id: "default", title: "Current Chat", date: "Today" },
    { id: "chat-1", title: "Gaming PC Quotation", date: "Yesterday" },
    { id: "chat-2", title: "Office Setup Inquiry", date: "2 days ago" },
    { id: "chat-3", title: "Laptop Recommendations", date: "1 week ago" },
  ];

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Chat Deleted",
      description: "Chat history has been removed.",
    });
    console.log("Deleting chat:", chatId);
  };

  return (
    <Card className="p-4 border-blue-200">
      <h3 className="font-medium text-gray-900 mb-3">Previous Chats</h3>
      
      <div className="space-y-2">
        {mockChats.map((chat) => (
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
