"use client";

import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
  collectedInfo?: Record<string, string>;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Hello! I'm your sales agent. How are you doing? Feel free to inquire me about anything related to computer and its peripherals. May I know your name!",
  sender: "bot",
  timestamp: new Date(),
};

export default function Index() {
  const [currentChatId, setCurrentChatId] = useState<string>("default");

  const [allChats, setAllChats] = useState<Record<string, Message[]>>({
    default: [WELCOME_MESSAGE],
  });

  // 🧠 Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("allChats");
    const parsed = stored ? JSON.parse(stored) : null;

    if (parsed) {
      // Convert timestamp strings back to Date objects
      const revived = Object.fromEntries(
        Object.entries(parsed).map(([id, msgs]) => [
          id,
          msgs.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        ])
      );

      setAllChats(revived);
    }
  }, []);

  // 💾 Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("allChats", JSON.stringify(allChats));
  }, [allChats]);

  const handleChatSelect = (chatId: string) => {
    setAllChats((prev) => {
      if (!prev[chatId]) {
        return {
          ...prev,
          [chatId]: [
            {
              ...WELCOME_MESSAGE,
              id: `welcome-${chatId}`,
              timestamp: new Date(),
            },
          ],
        };
      }
      return prev;
    });

    setCurrentChatId(chatId);
  };

  const handleMessagesChange = (messages: Message[]) => {
    setAllChats((prev) => ({
      ...prev,
      [currentChatId]: messages,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            allChats={allChats}
            setAllChats={setAllChats}
            setCurrentChatId={setCurrentChatId}
          />
          <main className="flex-1 flex flex-col">
            <ChatInterface
            key={currentChatId} // 👈 this line forces full component re-initialization
            chatId={currentChatId}
            messages={allChats[currentChatId] || []}
            onMessagesChange={handleMessagesChange}
          />

          </main>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
