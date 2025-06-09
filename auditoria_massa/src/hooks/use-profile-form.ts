
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  crm: z.string(),
  specialty: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
  hospital: z.string().min(2, "Hospital deve ter pelo menos 2 caracteres"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres")
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useProfileForm = () => {
  const { updateProfile } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
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

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        telefone: data.phone, // Map to the expected property name
        crm: data.crm,
        especialidade: data.specialty, // Map to the expected property name
        hospital: data.hospital,
        bio: data.bio
      });
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  return {
    form,
    onSubmit
  };
};
