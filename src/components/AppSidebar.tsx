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
import { LanguageToggle } from "./LanguageToggle";
import { ChatHistory } from "./ChatHistory";
import { t } from "@/i18n";
import { useLanguage } from "@/contexts/LanguageContext";


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

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    onChatSelect(newChatId);
    setActiveSection("chat");
  };
  const { mode } = useLanguage();

  return (
    <Sidebar className="border-r border-blue-200">
      <SidebarHeader className="border-b border-blue-100 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-gray-900">{t("appTitle", mode)}</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {t("subTitle", mode)}
        </p>

        {/* language selector */}
        <div className="mt-3">
          <LanguageToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel>{t("actions", mode)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  onClick={handleNewChat}
                  className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  {t("newChat", mode)}
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("features", mode)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("upload")}
                  className={activeSection === "upload" ? "bg-blue-100" : ""}
                >
                  <Upload className="w-4 h-4" />
                  {t("uploadFile", mode)}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("history")}
                  className={activeSection === "history" ? "bg-blue-100" : ""}
                >
                  <History className="w-4 h-4" />
                  {t("chatHistory", mode)}
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
