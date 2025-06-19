import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuotationActionsProps {
  quotationText: string; // Raw quotation output or prettified version
  clientInfo: Record<string, string>; // name, company, email, etc.
}

interface Quotation {
  productName: string;
  specs: string;
  price: string;
  quantity: string;
  totalPrice: string;
}

function parseQuotations(text: string): { quotations: Quotation[]; recommendation: string } {
  const quotationRegex = /## Quotation \d+\s+Product Name: (.*?)\s+Specs: (.*?)\s+Price: (.*?)\s+Quantity: (.*?)\s+Total Price: (.*?)(?=(## Quotation \d+|## Recommendation|$))/gs;
  const recommendationMatch = text.match(/## Recommendation([\s\S]*)$/);
  const recommendation = recommendationMatch ? recommendationMatch[1].trim() : "";

  const quotations: Quotation[] = [];
  let match;
  while ((match = quotationRegex.exec(text)) !== null) {
    quotations.push({
      productName: match[1].trim(),
      specs: match[2].trim(),
      price: match[3].trim(),
      quantity: match[4].trim(),
      totalPrice: match[5].trim(),
    });
  }

  return { quotations, recommendation };
}

export function QuotationActions({ quotationText, clientInfo }: QuotationActionsProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState(clientInfo.email || "");
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { quotations, recommendation } = parseQuotations(quotationText);

  const handleDownload = async (type: "pdf" | "ppt") => {
    try {
      setDownloading(true);
      toast({
        title: `Generating ${type.toUpperCase()}`,
        description: `Please wait while we generate your quotation ${type.toUpperCase()}...`,
      });

      const endpoint = type === "ppt" ? "/generate-slides" : "/generate-pdf";
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotation_text: quotationText,
          client_info: clientInfo,
        }),
      });

      if (!response.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${new Date().toISOString().split("T")[0]}.${type === "ppt" ? "pptx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: `${type.toUpperCase()} Downloaded`,
        description: `Quotation ${type.toUpperCase()} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error(`Error downloading ${type.toUpperCase()}:`, error);
      toast({
        title: "Download Failed",
        description: `Unable to generate ${type.toUpperCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address before sending.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch("http://localhost:8000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: email,
          subject: `Quotation for ${clientInfo.name || "Client"}`,
          body: `Dear ${clientInfo.name || "Client"},\n\nPlease find attached your quotation.\n\nRegards,\nYour Company`,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        toast({
          title: "Email Sent",
          description: "Quotation email has been sent successfully.",
        });
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Send email error:", error);
      toast({
        title: "Email Sending Failed",
        description: "Could not send the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="ml-11 mt-2 p-4 bg-blue-50 border-blue-200 space-y-5">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Quotation Ready</span>
      </div>

      {/* Render quotations */}
      <div className="space-y-3">
        {quotations.map((q, idx) => (
          <div key={idx} className="border rounded p-3 bg-white shadow-sm">
            <h4 className="text-md font-semibold text-blue-700 mb-2">Quotation {idx + 1}</h4>
            <p><span className="font-medium">Product:</span> {q.productName}</p>
            <p><span className="font-medium">Specs:</span> {q.specs}</p>
            <p><span className="font-medium">Price:</span> {q.price}</p>
            <p><span className="font-medium">Quantity:</span> {q.quantity}</p>
            <p><span className="font-medium">Total:</span> {q.totalPrice}</p>
          </div>
        ))}
      </div>

      {/* Render recommendation */}
      {recommendation && (
        <div className="border rounded p-4 bg-green-50 shadow-sm">
          <h4 className="text-md font-semibold text-green-700 mb-2">Recommendation</h4>
          <p className="text-gray-800 whitespace-pre-wrap">{recommendation}</p>
        </div>
      )}

      {/* Download and email buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDownload("pdf")}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
          disabled={downloading}
        >
          <Download className="w-4 h-4 mr-1" />
          {downloading ? "Downloading..." : "Download PDF"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDownload("ppt")}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
          disabled={downloading}
        >
          <Download className="w-4 h-4 mr-1" />
          {downloading ? "Downloading..." : "Download PPT"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm flex-grow"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleSendEmail}
          disabled={sending}
          className="border-green-400 text-green-700 hover:bg-green-100"
        >
          <Mail className="w-4 h-4 mr-1" />
          {sending ? "Sending..." : "Send Email"}
        </Button>
      </div>
    </Card>
  );
}
