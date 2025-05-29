
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Upload, Download, History } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ChatHistory } from "./ChatHistory";

interface AppSidebarProps {
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
}

export function AppSidebar({ currentChatId, onChatSelect }: AppSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("chat");

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
          <h1 className="font-bold text-gray-900">Sales Agent Bot</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Computer & Peripherals Expert
        </p>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button 
                  onClick={handleNewChat}
                  className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
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
                  Upload File
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveSection("history")}
                  className={activeSection === "history" ? "bg-blue-100" : ""}
                >
                  <History className="w-4 h-4" />
                  Chat History
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeSection === "upload" && <FileUpload />}
        {activeSection === "history" && (
          <ChatHistory 
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
