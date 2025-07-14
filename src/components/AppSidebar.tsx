import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Upload, History } from "lucide-react";
//import { FileUpload } from "./FileUpload";
import { ChatHistory } from "./ChatHistory";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/i18n";


interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
  collectedInfo?: Record<string, string>;
}

interface AppSidebarProps {
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  allChats: Record<string, Message[]>;
  setAllChats: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  setCurrentChatId: (chatId: string) => void;
}

export function AppSidebar({
  currentChatId,
  onChatSelect,
  allChats,
  setAllChats,
  setCurrentChatId,
}: AppSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("chat");
  const { language } = useLanguage();

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    onChatSelect(newChatId);
    setActiveSection("chat");
  };

  return (
    <Sidebar className="border-r border-blue-200">
      <SidebarHeader className="border-b border-blue-100 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
            <h1 className="font-bold text-gray-900">
            {t("appTitle", language)}
           </h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {t("subtitle", language)}
        </p>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel>{t("actions", language)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  onClick={handleNewChat}
                  className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <SidebarGroupLabel>{t("newChat", language)}</SidebarGroupLabel>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("allChats"); // 🧹 Clear chat history
                  window.location.href = "/login";
                }}
                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {/* Optional logout icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                <SidebarGroupLabel>Logout</SidebarGroupLabel>
              </Button>
            </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("upload")}
                  className={activeSection === "upload" ? "bg-blue-100" : ""}
                >
                  <Upload className="w-4 h-4" />
                  {t("uploadFile", language)}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("history")}
                  className={activeSection === "history" ? "bg-blue-100" : ""}
                >
                  <History className="w-4 h-4" />
                  {t("chatHistory", language)}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        
        {activeSection === "history" && (
          <ChatHistory
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
            allChats={allChats}
            setAllChats={setAllChats}
            setCurrentChatId={setCurrentChatId}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
