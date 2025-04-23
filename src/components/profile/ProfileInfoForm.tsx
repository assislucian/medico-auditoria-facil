
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileInfoForm = () => {
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
      await updateProfile(data);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="crm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRM</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital/Clínica Principal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
};
