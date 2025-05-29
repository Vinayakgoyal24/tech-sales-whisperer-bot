
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string>("default");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar 
            currentChatId={currentChatId}
            onChatSelect={setCurrentChatId}
          />
          <main className="flex-1 flex flex-col">
            <ChatInterface chatId={currentChatId} />
          </main>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default Index;
