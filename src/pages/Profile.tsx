
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dra. Ana Silva",
    email: "dr.anasilva@exemplo.med.br",
    telefone: "(11) 98765-4321",
    crm: "123456/SP",
    especialidade: "Ortopedia",
    hospital: "Hospital São Paulo",
    bio: "Especialista em cirurgia ortopédica com mais de 10 anos de experiência. Foco em tratamentos minimamente invasivos e recuperação rápida."
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
    setSaving(true);
    
    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso."
    });
    
    setSaving(false);
  };

  return (
    <>
      <Helmet>
        <title>Perfil | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="mb-6">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-2xl font-bold">{formData.name}</h3>
                    <p className="text-muted-foreground">{formData.especialidade}</p>
                    <p className="text-sm mt-1">CRM: {formData.crm}</p>
                    
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary">Ortopedia</Badge>
                      <Badge variant="secondary">Traumatologia</Badge>
                      <Badge variant="outline">Cirurgia</Badge>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">127</p>
                          <p className="text-sm text-muted-foreground">Análises</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">R$ 12.450</p>
                          <p className="text-sm text-muted-foreground">Recuperados</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        Editar Foto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:w-2/3">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                    <TabsTrigger value="notifications">Notificações</TabsTrigger>
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
                          
                          <Button type="submit" disabled={saving} className="w-full md:w-auto">
                            {saving ? "Salvando..." : "Salvar Alterações"}
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
                          <Button className="w-full md:w-auto">Alterar Senha</Button>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-4">Autenticação em Duas Etapas</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">Proteja sua conta com autenticação em duas etapas</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Receba um código de verificação no seu celular ao fazer login
                              </p>
                            </div>
                            <Button variant="outline">Configurar</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notificações</CardTitle>
                        <CardDescription>
                          Configure como e quando deseja receber notificações
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-b pb-4">
                            <h4 className="text-sm font-medium mb-3">Preferências de Email</h4>
                            <div className="space-y-3">
                              {[
                                "Novos relatórios disponíveis",
                                "Atualizações do sistema",
                                "Dicas e recomendações",
                                "Boletins informativos mensais"
                              ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <input type="checkbox" id={`email-${i}`} defaultChecked={i < 2} className="rounded text-primary focus:ring-primary" />
                                  <Label htmlFor={`email-${i}`}>{item}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Preferências de SMS</h4>
                            <div className="space-y-3">
                              {[
                                "Alertas críticos",
                                "Recuperação de valores significativos",
                                "Lembretes de faturas"
                              ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <input type="checkbox" id={`sms-${i}`} defaultChecked={i === 0} className="rounded text-primary focus:ring-primary" />
                                  <Label htmlFor={`sms-${i}`}>{item}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button className="mt-4 w-full md:w-auto">Salvar Preferências</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="font-medium">Documentos Analisados:</dt>
                      <dd>127</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Divergências Detectadas:</dt>
                      <dd>42</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Taxa de Divergência:</dt>
                      <dd>33%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Valor Total Recuperado:</dt>
                      <dd>R$ 12.450,75</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Operadoras mais Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { name: "Amil", percent: 35 },
                      { name: "Unimed", percent: 28 },
                      { name: "Bradesco Saúde", percent: 18 },
                      { name: "SulAmérica", percent: 12 },
                      { name: "Outros", percent: 7 }
                    ].map((item, i) => (
                      <li key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades Registradas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Ortopedia</Badge>
                    <Badge>Traumatologia</Badge>
                    <Badge>Artroscopia</Badge>
                    <Badge>Cirurgia de Joelho</Badge>
                    <Badge>Cirurgia de Mão</Badge>
                    <Badge>Cirurgia da Coluna</Badge>
                    <Badge>Cirurgia de Ombro</Badge>
                    <Badge>Medicina Esportiva</Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Gerenciar Especialidades
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
