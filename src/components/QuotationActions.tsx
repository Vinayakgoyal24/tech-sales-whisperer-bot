
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuotationActions() {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your quotation PDF...",
      });

      const response = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Downloaded",
        description: "Quotation PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPPT = async () => {
    try {
      toast({
        title: "Generating PPT",
        description: "Please wait while we generate your quotation presentation...",
      });

      const response = await fetch('http://localhost:8000/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate PPT');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${new Date().toISOString().split('T')[0]}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PPT Downloaded", 
        description: "Quotation PowerPoint has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading PPT:', error);
      toast({
        title: "Download Failed",
        description: "Unable to generate PowerPoint. Please try again.",
        variant: "destructive",
      });
    }
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
