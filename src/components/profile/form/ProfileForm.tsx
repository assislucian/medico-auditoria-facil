
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfileForm } from "@/hooks/use-profile-form";
import { BasicInfoFields } from "../form-fields/BasicInfoFields";
import { ProfessionalFields } from "../form-fields/ProfessionalFields";
import { ProfileImageUpload } from "../image/ProfileImageUpload";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  crm: z.string(),
  especialidade: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
  hospital: z.string().min(2, "Hospital deve ter pelo menos 2 caracteres"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres")
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  loading: boolean;
  onSubmit: (data: ProfileFormValues, selectedImage: File | null) => Promise<void>;
}

export const ProfileForm = ({ loading, onSubmit }: ProfileFormProps) => {
  const form = useProfileForm();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalValues] = useState(form.getValues());

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (data: ProfileFormValues) => {
    await onSubmit(data, selectedImage);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    form.reset(originalValues);
    setSelectedImage(null);
    setImagePreview(null);
    toast.info("Alterações canceladas", {
      description: "As alterações foram descartadas."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ProfessionalFields form={form} />
        <ProfileImageUpload
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
