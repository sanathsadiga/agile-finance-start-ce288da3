
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogoUploaderProps {
  initialLogo?: string | null;
  onLogoChange: (logo: string | null) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ initialLogo, onLogoChange }) => {
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Create a new image to check dimensions
    const img = new Image();
    img.onload = () => {
      // File is valid, process it
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        onLogoChange(base64String);
        setIsUploading(false);
        
        toast({
          title: "Logo uploaded",
          description: "Your logo has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    };
    
    img.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to process image.",
        variant: "destructive",
      });
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Logo removed",
      description: "Your logo has been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Company Logo</h3>
        <div className="flex gap-2">
          {logo && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleRemoveLogo}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4 mr-1" />
            )}
            {logo ? "Change Logo" : "Upload Logo"}
          </Button>
        </div>
      </div>
      
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
      />
      
      {logo ? (
        <div className="border border-gray-200 rounded-md p-4 flex items-center justify-center bg-gray-50">
          <div className="w-32 h-32 relative overflow-hidden">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div 
          className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleUploadClick}
        >
          <Image className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Upload your company logo</p>
          <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 500x500px recommended</p>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
