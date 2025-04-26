
import { useState } from 'react';
import { PublicLayout } from "@/layout/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Calendar, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    assunto: "",
    mensagem: ""
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
    setSending(true);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Mensagem enviada",
      description: "Recebemos sua mensagem e responderemos em breve."
    });
    
    setFormData({
      name: "",
      email: "",
      assunto: "",
      mensagem: ""
    });
    
    setSending(false);
  };

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, link: "https://linkedin.com/company/medcheck" },
    { name: "Twitter", icon: Twitter, link: "https://twitter.com/medcheck" },
    { name: "Instagram", icon: Instagram, link: "https://instagram.com/medcheck" },
    { name: "Facebook", icon: Facebook, link: "https://facebook.com/medcheck" }
  ];

  return (
    <PublicLayout 
      title="Contato | MedCheck"
      description="Entre em contato com a equipe do MedCheck. Estamos aqui para ajudar."
      showBackButton={true}
    >
      <motion.div 
        className="container py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para ajudar com qualquer dúvida sobre a plataforma, planos ou suporte técnico.
            Nossa equipe responderá o mais rápido possível.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder="Dr. João Silva"
                        required
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
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, assunto: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suporte">Suporte Técnico</SelectItem>
                          <SelectItem value="comercial">Informações Comerciais</SelectItem>
                          <SelectItem value="sugestao">Sugestões</SelectItem>
                          <SelectItem value="reclamacao">Reclamações</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <Textarea 
                        id="mensagem" 
                        name="mensagem"
                        value={formData.mensagem} 
                        onChange={handleChange}
                        placeholder="Como podemos ajudar?"
                        required
                        rows={5}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={sending}>
                    {sending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <p className="text-muted-foreground">(11) 3456-7890</p>
                    <p className="text-muted-foreground">Segunda à Sexta, 9h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">contato@medcheck.com.br</p>
                    <p className="text-muted-foreground">suporte@medcheck.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <h4 className="font-medium">Endereço</h4>
                    <p className="text-muted-foreground">Av. Paulista, 1000</p>
                    <p className="text-muted-foreground">Bela Vista, São Paulo - SP</p>
                    <p className="text-muted-foreground">CEP: 01310-100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Horário de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start mb-4">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">Quando estamos disponíveis</h4>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Segunda à Sexta</span>
                    <span>9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span>9h às 13h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo e Feriados</span>
                    <span>Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name} 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <social.icon className="h-5 w-5 mr-2 text-primary" />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PublicLayout>
  );
};

export default Contact;
