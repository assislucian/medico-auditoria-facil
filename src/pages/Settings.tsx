
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SideNav } from "@/components/SideNav";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. Ana Silva",
    email: "dr.anasilva@exemplo.med.br",
    crm: "123456/SP",
    especialidade: "Ortopedia",
    notificacoesEmail: true,
    notificacoesSMS: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso."
    });
    
    setSaving(false);
  };

  return (
    <>
      <Helmet>
        <title>Configurações | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Configurações</h1>
            
            <Tabs defaultValue="perfil" className="space-y-6">
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 md:grid-cols-none h-auto">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                <TabsTrigger value="tabelas">Tabelas de Referência</TabsTrigger>
              </TabsList>
              
              <TabsContent value="perfil">
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
              </TabsContent>
              
              <TabsContent value="notificacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Notificação</CardTitle>
                    <CardDescription>
                      Configure como você deseja receber notificações do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por Email</p>
                        <p className="text-sm text-muted-foreground">
                          Receba alertas sobre novos relatórios por email
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notificacoesEmail} 
                        onCheckedChange={(checked) => handleToggleChange('notificacoesEmail', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Receba alertas sobre novos relatórios por SMS
                        </p>
                      </div>
                      <Switch 
                        checked={formData.notificacoesSMS} 
                        onCheckedChange={(checked) => handleToggleChange('notificacoesSMS', checked)}
                      />
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tabelas">
                <Card>
                  <CardHeader>
                    <CardTitle>Tabelas de Referência</CardTitle>
                    <CardDescription>
                      Configure quais tabelas de valores médicos você deseja usar como referência
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="cbhpm" defaultChecked />
                        <div>
                          <Label htmlFor="cbhpm">CBHPM 2022</Label>
                          <p className="text-sm text-muted-foreground">
                            Classificação Brasileira Hierarquizada de Procedimentos Médicos
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="tuss" defaultChecked />
                        <div>
                          <Label htmlFor="tuss">TUSS 2022</Label>
                          <p className="text-sm text-muted-foreground">
                            Terminologia Unificada da Saúde Suplementar
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="amb" />
                        <div>
                          <Label htmlFor="amb">AMB 92</Label>
                          <p className="text-sm text-muted-foreground">
                            Associação Médica Brasileira
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleSubmit} disabled={saving}>
                          {saving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
