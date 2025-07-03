import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en-US" | "ja-JP";

interface LangCtx {
  language: Lang;
  setLanguage: (l: Lang) => void;
}
const LanguageContext = createContext<LangCtx>({
  language: "en-US",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("en-US");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
