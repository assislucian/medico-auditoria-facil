
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, HeartHandshake, ShieldCheck, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Sobre | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="bg-primary/5 py-16">
          <div className="container text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre o MedCheck</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transformando a maneira como médicos gerenciam seus pagamentos e validam seus honorários.
            </p>
          </div>
        </div>
        
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg mb-4">
                Criamos o MedCheck com uma missão clara: garantir que médicos recebam o pagamento justo por seus serviços.
              </p>
              <p className="text-muted-foreground mb-6">
                Sabemos que médicos dedicam seu tempo e expertise para cuidar dos pacientes, não para lidar com burocracias e verificar pagamentos. 
                Nossa plataforma automatiza todo esse processo, permitindo que profissionais da saúde foquem no que realmente importa: o cuidado com os pacientes.
              </p>
              <div className="space-y-3">
                {[
                  "Validação automatizada de pagamentos",
                  "Comparação com tabelas de referência CBHPM",
                  "Detecção de divergências em honorários",
                  "Geração de relatórios detalhados"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <blockquote className="italic text-lg">
                "O MedCheck transformou completamente a maneira como gerencio meus pagamentos. Descobri que estava deixando de receber cerca de 15% dos meus honorários anualmente. Agora tenho controle total e tempo para focar nos meus pacientes."
                <footer className="mt-4 font-medium not-italic">
                  - Dra. Mariana Costa, Cardiologista
                </footer>
              </blockquote>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Transparência</h3>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Acreditamos em relações claras e transparentes. Nossas análises são precisas e fundamentadas nas tabelas oficiais do setor médico.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Confiança</h3>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Construímos um sistema confiável que médicos podem utilizar para validar seus pagamentos com segurança e assertividade.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Inovação</h3>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Usamos tecnologia de ponta para automatizar processos complexos, tornando acessível a verificação detalhada de honorários.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa História</h2>
            <div className="space-y-8 relative before:content-[''] before:absolute before:left-1/2 before:-ml-px before:h-full before:border-l before:border-dashed before:border-border">
              {[
                {
                  year: "2020",
                  title: "A Ideia Inicial",
                  description: "O MedCheck nasceu da necessidade identificada por um grupo de médicos que enfrentavam dificuldades para validar seus pagamentos."
                },
                {
                  year: "2021",
                  title: "Desenvolvimento da Plataforma",
                  description: "Com uma equipe de especialistas em saúde e tecnologia, desenvolvemos a primeira versão do sistema com foco na usabilidade."
                },
                {
                  year: "2022",
                  title: "Lançamento Oficial",
                  description: "Após meses de testes e aprimoramentos, o MedCheck foi oficialmente lançado para o mercado brasileiro."
                },
                {
                  year: "2023",
                  title: "Expansão Nacional",
                  description: "Alcançamos médicos em todo o Brasil, com um crescimento de 300% em nossa base de usuários."
                },
                {
                  year: "2024",
                  title: "Inovação Contínua",
                  description: "Implementação de inteligência artificial para análise preditiva e detecção avançada de padrões de pagamento."
                }
              ].map((item, index) => (
                <div key={index} className="relative pl-10 md:pl-0">
                  <div className="md:flex items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right">
                      <div className="md:hidden absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-background"></div>
                      </div>
                      {index % 2 === 0 ? (
                        <>
                          <h3 className="text-xl font-bold">{item.year}</h3>
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </>
                      ) : (
                        <div className="hidden md:block">
                          <div className="absolute left-1/2 top-0 -ml-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block md:w-1/2 md:pl-12 md:text-left">
                      {index % 2 === 1 ? (
                        <>
                          <h3 className="text-xl font-bold">{item.year}</h3>
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </>
                      ) : (
                        <div className="hidden md:block">
                          <div className="absolute left-1/2 top-0 -ml-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-background"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:hidden mt-2">
                      {index % 2 === 1 && (
                        <>
                          <h3 className="text-xl font-bold">{item.year}</h3>
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Nossa Comunidade</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              Milhares de médicos já transformaram a maneira como validam seus honorários.
              Seja parte dessa evolução e garanta o pagamento justo pelos seus serviços.
            </p>
            <Button size="lg" className="mb-6">
              Experimente Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              14 dias de teste grátis. Sem compromisso.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
