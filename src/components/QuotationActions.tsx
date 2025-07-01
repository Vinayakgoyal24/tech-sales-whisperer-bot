import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import posthog from 'posthog-js';

interface QuotationActionsProps {
  quotationText: string;
  clientInfo: Record<string, string>;
}

interface Product {
  productName: string;
  specs: string;
  price: string;
  quantity: string;
  totalPrice: string;
}

interface Quotation {
  products: Product[];
  combinedTotal?: string;
}

function parseQuotations(text: string): { quotations: Quotation[]; recommendation: string } {
  const FIELD_LABELS = {
    productName: ["Product Name", "商品名"],
    specs: ["Specs", "仕様"],
    price: ["Price", "単価", "価格"],
    quantity: ["Quantity", "数量"],
    totalPrice: ["Total", "Total Price", "合計金額"],
  };

  const matchField = (line: string, key: keyof typeof FIELD_LABELS) =>
    FIELD_LABELS[key].some(label => line.startsWith(`${label}:`));

  const extractValue = (line: string) => line.split(":").slice(1).join(":").trim();

  const recommendationMatch = text.match(/##\s*(Recommendation|推奨案|推奨)([\s\S]*)$/i);
  const recommendation = recommendationMatch ? recommendationMatch[2].trim() : "";

  const quotationBlocks = text
    .split(/##\s*(Quotation\s*\d+|見積り\d+|見積もり\d+)/i)
    .slice(1)
    .filter((_, idx) => idx % 2 === 1);

  const quotations: Quotation[] = [];

  for (const block of quotationBlocks) {
    const lines = block.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const products: Product[] = [];
    let currentProduct: Partial<Product> = {};
    let specsLines: string[] = [];
    let capturingSpecs = false;

    for (const line of lines) {
      if (matchField(line, "productName")) {
        if (Object.keys(currentProduct).length > 0) {
          currentProduct.specs = currentProduct.specs || specsLines.join(" | ");
          products.push({
            productName: currentProduct.productName || "N/A",
            specs: currentProduct.specs || "N/A",
            price: currentProduct.price || "N/A",
            quantity: currentProduct.quantity || "N/A",
            totalPrice: currentProduct.totalPrice || "N/A",
          });
          currentProduct = {};
          specsLines = [];
        }
        currentProduct.productName = extractValue(line);
        capturingSpecs = false;
      } else if (matchField(line, "specs")) {
        const value = extractValue(line);
        if (value) {
          currentProduct.specs = value;
          capturingSpecs = false;
        } else {
          capturingSpecs = true;
          specsLines = [];
        }
      } else if (capturingSpecs && line.startsWith("-")) {
        specsLines.push(line.replace(/^-/, "").trim());
      } else if (matchField(line, "price")) {
        const priceMatch = line.match(/¥[\d,]+(\.\d+)?/);
        currentProduct.price = priceMatch ? priceMatch[0] : extractValue(line);
        capturingSpecs = false;
      } else if (matchField(line, "quantity")) {
        const qtyMatch = line.match(/\d+/);
        currentProduct.quantity = qtyMatch ? qtyMatch[0] : extractValue(line);
      } else if (matchField(line, "totalPrice")) {
        const totalMatch = line.match(/¥[\d,]+(\.\d+)?/);
        currentProduct.totalPrice = totalMatch ? totalMatch[0] : extractValue(line);
      } else if (/total combined price|合計金額合算/i.test(line)) {
        const totalMatch = line.match(/¥[\d,]+(\.\d+)?/);
        quotations.push({
          products,
          combinedTotal: totalMatch ? totalMatch[0] : extractValue(line),
        });
        return { quotations, recommendation };
      }
    }

    if (Object.keys(currentProduct).length > 0) {
      currentProduct.specs = currentProduct.specs || specsLines.join(" | ");
      products.push({
        productName: currentProduct.productName || "N/A",
        specs: currentProduct.specs || "N/A",
        price: currentProduct.price || "N/A",
        quantity: currentProduct.quantity || "N/A",
        totalPrice: currentProduct.totalPrice || "N/A",
      });
    }

    quotations.push({ products });
  }

  return { quotations, recommendation };
}

export function QuotationActions({ quotationText, clientInfo }: QuotationActionsProps) {
  const { toast } = useToast();
  const [emails, setEmails] = useState(clientInfo.email || "");
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
      posthog.capture('quotation_downloaded', {
      type: type.toUpperCase(),
      client_email: clientInfo.email || 'unknown',
      has_recommendation: !!recommendation,
      product_count: quotations.reduce((acc, q) => acc + q.products.length, 0),
    });
    } 
    catch (error) {
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
    const emailList = emails
      .split(",")
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailList.length === 0) {
      toast({
        title: "Email Required",
        description: "Please enter at least one valid email address.",
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
          to_emails: emailList,
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

      <div className="space-y-3">
        {quotations.map((q, idx) => (
          <div key={idx} className="border rounded p-3 bg-white shadow-sm">
            <h4 className="text-md font-semibold text-blue-700 mb-2">Quotation {idx + 1}</h4>
            {q.products.map((p, pIdx) => (
              <div key={pIdx} className="mb-3 border-b pb-2">
                <p><span className="font-medium">Product:</span> {p.productName}</p>
                <p><span className="font-medium">Specs:</span> {p.specs}</p>
                <p><span className="font-medium">Price:</span> {p.price}</p>
                <p><span className="font-medium">Quantity:</span> {p.quantity}</p>
                <p><span className="font-medium">Total:</span> {p.totalPrice}</p>
              </div>
            ))}
            {q.combinedTotal && (
              <p className="text-green-700 font-semibold mt-2">
                Combined Total: {q.combinedTotal}
              </p>
            )}
          </div>
        ))}
      </div>

      {recommendation && (
        <div className="border rounded p-4 bg-green-50 shadow-sm">
          <h4 className="text-md font-semibold text-green-700 mb-2">Recommendation</h4>
          <p className="text-gray-800 whitespace-pre-wrap">{recommendation}</p>
        </div>
      )}

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
          type="text"
          placeholder="Enter email addresses separated by commas"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
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
