
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuotationActions() {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Downloaded",
      description: "Quotation PDF has been downloaded successfully.",
    });
    // Simulate PDF download
    console.log("Downloading PDF quotation...");
  };

  const handleDownloadPPT = () => {
    toast({
      title: "PPT Downloaded", 
      description: "Quotation PowerPoint has been downloaded successfully.",
    });
    // Simulate PPT download
    console.log("Downloading PPT quotation...");
  };

  return (
    <Card className="ml-11 mt-2 p-3 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Quotation Ready</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadPDF}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Download className="w-4 h-4 mr-1" />
          Download PDF
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadPPT}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Download className="w-4 h-4 mr-1" />
          Download PPT
        </Button>
      </div>
    </Card>
  );
}
