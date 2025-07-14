"use client";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";
import { useLanguage } from "@/contexts/LanguageContext";          // ← NEW ✨

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  hasQuotation?: boolean;
  collectedInfo?: Record<string, string>;
}

export default function Index() {
  /* ------------------------------------------------------------------ */
  /* 1️⃣  Get the current UI language ("en-US" / "ja-JP") from context   */
  /* ------------------------------------------------------------------ */
  const { language } = useLanguage();                                // ← NEW

  /* ------------------------------------------------------------------ */
  /* 2️⃣  Build the welcome message in that language                     */
  /* ------------------------------------------------------------------ */
  const createWelcomeMessage = (): Message => ({
    id: "welcome",
    text:
      language === "ja-JP"
        ? "こんにちは！私は営業アシスタントです。コンピュータや周辺機器について何でもお尋ねください。お名前を教えていただけますか？"
        : "Hello! I'm your sales agent. How are you doing? Feel free to inquire about anything related to computers and peripherals. May I know your name!",
    sender: "bot",
    timestamp: new Date(),
  });

  /* ------------------------------------------------------------------ */
  /* 3️⃣  Initial state (runs once) and “New Chat” seeding               */
  /* ------------------------------------------------------------------ */
  const [currentChatId, setCurrentChatId] = useState<string>("default");
  const [allChats, setAllChats] = useState<Record<string, Message[]>>({
    default: [createWelcomeMessage()],
  });

  // 🧠 Load chats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("allChats");
    if (stored) {
      const parsed = JSON.parse(stored);
      const revived = Object.fromEntries(
        Object.entries(parsed).map(([id, msgs]) => [
          id,
          msgs.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })),
        ])
      );
      setAllChats(revived);
    }
  }, []);

  // 💾 Persist chats whenever they change
  useEffect(() => {
    localStorage.setItem("allChats", JSON.stringify(allChats));
  }, [allChats]);

  /* New-chat handler: seed with a language-appropriate greeting */
  const handleChatSelect = (chatId: string) => {
    setAllChats((prev) => {
      if (!prev[chatId]) {
        return { ...prev, [chatId]: [{ ...createWelcomeMessage(), id: `welcome-${chatId}` }] };
      }
      return prev;
    });
    setCurrentChatId(chatId);
  };

  const handleMessagesChange = (messages: Message[]) =>
    setAllChats((prev) => ({ ...prev, [currentChatId]: messages }));

  /* ------------------------------------------------------------------ */
  /* 4️⃣  Render                                                         */
  /* ------------------------------------------------------------------ */
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
              key={currentChatId}
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