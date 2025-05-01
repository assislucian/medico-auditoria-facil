
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { useState } from "react";

interface ProfileImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
}

export const ProfileImageUpload = ({ imagePreview, onImageUpload }: ProfileImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem no formato JPG ou PNG"
      });
      return;
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("Arquivo grande demais", {
        description: "A imagem deve ter no máximo 2MB"
      });
      return;
    }

    onImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    validateAndProcessFile(files[0]);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base">Foto de Perfil</Label>
      <div className="flex flex-col items-center">
        <div 
          className={`relative mb-4 ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Avatar className="h-32 w-32 border-2 border-muted">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="Preview" className="object-cover" />
            ) : (
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                <Camera className="h-10 w-10" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="w-full">
          <Label htmlFor="avatar" className="w-full">
            <Button 
              variant="outline" 
              className="w-full cursor-pointer flex items-center gap-2"
              type="button"
              asChild
            >
              <div>
                <Upload className="h-4 w-4" />
                <span>{imagePreview ? "Trocar foto" : "Carregar foto"}</span>
              </div>
            </Button>
          </Label>
          <Input
            id="avatar"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Arraste uma imagem ou clique para selecionar (JPG ou PNG, máx 2MB)
          </p>
        </div>
      </div>
    </div>
  );
};
