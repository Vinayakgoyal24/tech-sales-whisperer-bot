import { createContext, useContext, useState, ReactNode } from "react";

export type LangMode = "auto" | "en" | "ja";

interface LangCtx {
  mode: LangMode;
  setMode: (m: LangMode) => void;
}

const LanguageContext = createContext<LangCtx>({
  mode: "auto",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [mode, setMode] = useState<LangMode>("auto");
  return (
    <LanguageContext.Provider value={{ mode, setMode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LangCtx => useContext(LanguageContext);
