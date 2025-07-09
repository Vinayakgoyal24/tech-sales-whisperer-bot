import { Button } from "@/components/ui/button";
import { Globe, Languages, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle(): JSX.Element {
  const { mode, setMode } = useLanguage();

  const btnClasses =
    "px-2 py-1 text-xs border rounded-md flex items-center gap-1";

  return (
    <div className="flex gap-2">
      {[
        { id: "auto", label: "Auto", Icon: Zap },
        { id: "en", label: "English", Icon: Globe },
        { id: "ja", label: "日本語", Icon: Languages },
      ].map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant="outline"
          size="sm"
          className={`${btnClasses} ${
            mode === id ? "bg-blue-600 text-white border-blue-600" : ""
          }`}
          onClick={() => setMode(id as "auto" | "en" | "ja")}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
