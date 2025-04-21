
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile } from "@/hooks/use-profile";
import { validateCRM } from "@/utils/formatters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Check } from "lucide-react";
import { toast } from "sonner";

const profileFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  crm: z.string(),
  especialidade: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
  hospital: z.string().min(2, "Hospital deve ter pelo menos 2 caracteres"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres")
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileTabs = () => {
  const { loading, updateProfile, updateSecurity } = useProfile();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get the form hook with validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Dra. Ana Silva",
      email: "dr.anasilva@exemplo.med.br",
      telefone: "(11) 98765-4321",
      crm: "SP 123456",
      especialidade: "Ortopedia",
      hospital: "Hospital São Paulo",
      bio: "Especialista em cirurgia ortopédica com mais de 10 anos de experiência."
    }
  });

  // Store the original values for reset
  const [originalValues, setOriginalValues] = useState(form.getValues());

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem no formato JPG ou PNG"
      });
      return;
    }

    // Create preview
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle profile update
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Add the image to the form data if available
      const formData = new FormData();
      if (selectedImage) {
        formData.append('avatar', selectedImage);
      }
      
      // Add other form data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Call the API to update the profile
      const success = await updateProfile(data, selectedImage);
      
      if (success) {
        // Update original values for reset
        setOriginalValues(data);
        // Clear image selection
        setSelectedImage(null);
        toast.success("Perfil atualizado", {
          description: "Suas informações foram atualizadas com sucesso."
        });
      }
    } catch (error) {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível atualizar suas informações. Tente novamente."
      });
    }
  };

  // Handle security update
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = securityForm;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem", {
        description: "A nova senha e a confirmação devem ser iguais."
      });
      return;
    }

    try {
      const success = await updateSecurity({
        currentPassword,
        newPassword,
        confirmPassword
      });
      
      if (success) {
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Senha atualizada", {
          description: "Sua senha foi alterada com sucesso."
        });
      }
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description: "Não foi possível alterar sua senha. Tente novamente."
      });
    }
  };

  // Cancel changes and restore original values
  const handleCancel = () => {
    form.reset(originalValues);
    setSelectedImage(null);
    setImagePreview(null);
    toast.info("Alterações canceladas", {
      description: "As alterações foram descartadas."
    });
  };

  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full md:grid-cols-2 h-auto">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="telefone"
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
                          <Input {...field} disabled className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="especialidade"
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
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="avatar">Foto de Perfil</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {imagePreview ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                      <Input
                        id="avatar"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageUpload}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Alterar Senha</h4>
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Senha Atual</Label>
                  <Input 
                    id="current" 
                    name="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">Nova Senha</Label>
                  <Input 
                    id="new" 
                    name="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirm" 
                    name="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processando..." : "Alterar Senha"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
