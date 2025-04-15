
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";

export const ProfileTabs = () => {
  const { loading, updateProfile, updateSecurity } = useProfile();
  const [formData, setFormData] = useState({
    name: "Dra. Ana Silva",
    email: "dr.anasilva@exemplo.med.br",
    telefone: "(11) 98765-4321",
    crm: "123456/SP",
    especialidade: "Ortopedia",
    hospital: "Hospital São Paulo",
    bio: "Especialista em cirurgia ortopédica com mais de 10 anos de experiência."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    name="telefone"
                    value={formData.telefone} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input 
                    id="crm" 
                    name="crm"
                    value={formData.crm} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input 
                    id="especialidade" 
                    name="especialidade"
                    value={formData.especialidade} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clínica Principal</Label>
                  <Input 
                    id="hospital" 
                    name="hospital"
                    value={formData.hospital} 
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="bio">Biografia</Label>
                  <Input 
                    id="bio" 
                    name="bio"
                    value={formData.bio} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
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
              <div className="grid gap-2">
                <Label htmlFor="current">Senha Atual</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">Nova Senha</Label>
                <Input id="new" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                <Input id="confirm" type="password" />
              </div>
              <Button>Alterar Senha</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
