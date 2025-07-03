
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";   // ← ADD
import { t } from "@/utils/i18n"; 


export function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // For now, just store the file locally since no upload endpoint was specified
      // You can uncomment and modify this section when you have a file upload endpoint
      
      /*
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/upload-file', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      */
      
      setUploadedFile(file);
      toast({
        title: t("uploaded", language),
        description:
          language === "ja-JP"
            ? `${file.name} をアップロードしました。見積もり生成の準備完了です。`
            : `${file.name} uploaded successfully. Ready for quotation generation.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Unable to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
      <h3 className="font-medium text-gray-900 mb-3">
        {t("uploadTitle", language)}
      </h3>      
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">
            {t("uploadSubtitle", language)}
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? t("uploading", language) : t("chooseFile", language)}
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
