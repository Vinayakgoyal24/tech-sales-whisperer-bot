
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function VoiceButton() {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleVoiceInteraction = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Voice Recording Started",
        description: "Speak your query about products or quotations.",
      });
      
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        toast({
          title: "Voice Recording Stopped",
          description: "Processing your voice query...",
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: "Voice Recording Stopped",
        description: "Processing your voice query...",
      });
    }
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
