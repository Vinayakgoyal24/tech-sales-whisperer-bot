import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceButtonProps {
  setInputText: (text: string) => void;
}

export function VoiceButton({ setInputText }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleVoiceInteraction = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support Speech Recognition.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Voice Recording Started",
        description: "Speak your query about products or quotations.",
      });
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInputText(spokenText); // Send result to textbox
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast({
        title: "Voice Recording Ended",
        description: "You can now send your message.",
      });
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      toast({
        title: "Voice Error",
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
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
}
