
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

export const ProfileSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. Ana Silva",
    email: "dr.anasilva@exemplo.med.br",
    crm: "123456/SP",
    especialidade: "Ortopedia"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso."
    });
    
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informações de Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais e profissionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Tema:</span>
              <ThemeToggle />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
