//import { useState } from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const SILENCE_MS   = 1000;   // stop after 1 s of silence
const THRESHOLD    = 0.015;  // tweak: lower = more sensitive

interface VoiceButtonProps {
  setInputText: (text: string) => void;
}

export function VoiceButton({ setInputText }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const analyserRef      = useRef<AnalyserNode | null>(null);
  const silenceStartRef  = useRef<number | null>(null);

  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks: BlobPart[] = [];


      /* ─────  VAD setup  ───── */
      const ctx       = new AudioContext();
      const source    = ctx.createMediaStreamSource(stream);
      const analyser  = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.fftSize);

      const checkSilence = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
        analyser.getByteTimeDomainData(data);
        // Normalise 0–255 to −1…1 and compute avg absolute value
        const avg = data.reduce((s, v) => s + Math.abs(v - 128), 0) / data.length / 128;
        const now = performance.now();

        if (avg < THRESHOLD) {
          if (silenceStartRef.current === null) silenceStartRef.current = now;
          else if (now - silenceStartRef.current > SILENCE_MS) {
            stopRecording();                 // 🔴 auto-stop
            return;
          }
        } else {
          silenceStartRef.current = null;   // we heard speech → reset timer
        }
        requestAnimationFrame(checkSilence); // keep looping while recording
      };



      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        setIsRecording(false);
        ctx.close();                        // tidy up AudioContext
        analyserRef.current = null;
        const blob = new Blob(chunks, { type: "audio/webm" });

        // ⚠️ Some browsers record WebM/Opus; convert in back-end or force WAV here.
        // Here we send raw WebM and let back-end ffmpeg/faster-whisper handle it.
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        toast({ title: "Transcribing…", description: "Please wait." });
        const res = await fetch("http://localhost:8000/stt", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        const { text } = await res.json();
        if (text) setInputText(text);
        else toast({ title: "😕 No speech detected" });
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      requestAnimationFrame(checkSilence);  // 🔄 kick off VAD loop

      setIsRecording(true);
      toast({
        title: "Recording…",
        description: "Speak your query, click again to stop.",
      });
    } catch (err: any) {
      toast({
        title: "Microphone error",
        description: err.message ?? String(err),
      });
    }
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();

  const handleVoiceInteraction = () => {
    if (isRecording) stopRecording();
    else startRecording();
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
