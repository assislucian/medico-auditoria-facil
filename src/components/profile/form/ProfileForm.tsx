
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { BasicInfoFields } from "../form-fields/BasicInfoFields";
import { ProfessionalFields } from "../form-fields/ProfessionalFields";
import { ProfileImageUpload } from "../image/ProfileImageUpload";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  crm: z.string(),
  specialty: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
  hospital: z.string().min(2, "Hospital deve ter pelo menos 2 caracteres"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres")
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  loading: boolean;
  onSubmit: (data: { name: string; email: string; telefone: string; crm: string; especialidade: string; hospital: string; bio: string; }, selectedImage: File | null) => Promise<void>;
}

export const ProfileForm = ({ loading, onSubmit }: ProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Lucian",
      email: "dr.anasilva@exemplo.med.br",
      phone: "(11) 98765-4321",
      crm: "SP 123456",
      specialty: "Ortopedia",
      hospital: "Hospital São Paulo",
      bio: "Especialista em cirurgia ortopédica"
    }
  });

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

  const handleFormSubmit = async (data: ProfileFormValues) => {
    // Map the form values to the expected structure for the API
    await onSubmit({
      name: data.name,
      email: data.email,
      telefone: data.phone,
      crm: data.crm,
      especialidade: data.specialty,
      hospital: data.hospital,
      bio: data.bio
    }, selectedImage);
    
    setSelectedImage(null);
    setImagePreview(null);
    
    toast.success("Perfil atualizado", {
      description: "Suas alterações foram salvas com sucesso."
    });
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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          <div>
            <ProfileImageUpload
              imagePreview={imagePreview}
              onImageUpload={handleImageUpload}
            />
          </div>
          <div className="space-y-6">
            <BasicInfoFields form={form} />
            <ProfessionalFields form={form} />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4 border-t">
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
