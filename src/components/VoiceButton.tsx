import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";   // ← ADD


interface VoiceButtonProps { setInputText: (text: string) => void; }


export function VoiceButton({ setInputText }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { language: lang } = useLanguage();                 // ← ADD  (re-uses existing “lang” variable)


  const handleVoiceInteraction = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: lang === "ja-JP" ? "未対応" : "Not Supported",
        description:
          lang === "ja-JP"
            ? "このブラウザでは音声認識がサポートされていません。"
            : "Your browser doesn't support Speech Recognition.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: lang === "ja-JP" ? "録音開始" : "Voice Recording Started",
        description:
          lang === "ja-JP"
            ? "製品や見積もりに関するご質問を話してください。"
            : "Speak your query about products or quotations.",
      });
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInputText(spokenText);
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast({
        title: lang === "ja-JP" ? "録音終了" : "Voice Recording Ended",
        description:
          lang === "ja-JP"
            ? "入力された内容を送信できます。"
            : "You can now send your message.",
      });
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      toast({
        title: lang === "ja-JP" ? "エラー" : "Voice Error",
        description: event.error,
      });
    };

    recognition.start();
  };

  return (
    <Button
      onClick={handleVoiceInteraction}
      variant="outline"
      size="icon"
      className={`transition-colors ${
        isRecording
          ? "bg-red-100 border-red-300 text-red-700 animate-pulse"
          : "border-blue-200 hover:bg-blue-50"
      }`}
      title={lang === "ja-JP" ? "音声入力" : "Voice Input"}
      aria-label={lang === "ja-JP" ? "音声入力" : "Voice Input"}
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
}
