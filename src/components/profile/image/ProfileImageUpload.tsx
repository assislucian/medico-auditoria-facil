
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
}

export const ProfileImageUpload = ({ imagePreview, onImageUpload }: ProfileImageUploadProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem no formato JPG ou PNG"
      });
      return;
    }

    onImageUpload(file);
  };

  return (
    <div>
      <Label htmlFor="avatar">Foto de Perfil</Label>
      <div className="mt-2 flex items-center gap-4">
        {imagePreview && (
          <div className="relative h-24 w-24 overflow-hidden rounded-full border">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Input
          id="avatar"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageUpload}
          className="max-w-xs"
        />
      </div>
    </div>
  );
};
