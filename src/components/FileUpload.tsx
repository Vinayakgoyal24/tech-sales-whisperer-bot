
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully. Processing for quotation...`,
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    toast({
      title: "File Removed",
      description: "File has been removed from upload queue.",
    });
  };

  return (
    <Card className="p-4 border-blue-200">
      <h3 className="font-medium text-gray-900 mb-3">Upload File for Quotation</h3>
      
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            Upload a file with your requirements
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Choose File
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, TXT, XLS supported
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {uploadedFile.name}
              </span>
            </div>
            <Button
              onClick={removeFile}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-blue-600 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            File ready for quotation generation
          </p>
        </div>
      )}
    </Card>
  );
}
