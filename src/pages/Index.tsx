
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowRight, Upload, CheckCircle2, ChartBar, Coins, FileStack } from "lucide-react";
import PricingPlans from "@/components/PricingPlans";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  // Simple redirect function for pricing section
  const handleCheckoutRedirect = () => {
    // Always return true on the landing page since we'll handle the redirect in the PricingPlans component
    return true;
  };
  
  return (
    <>
      <Helmet>
        <title>MedCheck | Auditoria médica automatizada</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 px-6">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_50%)]"></div>
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Auditoria médica <span className="text-gradient">simplificada</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Identifique e recupere valores glosados pelos planos de saúde em procedimentos cirúrgicos de forma automática e eficiente.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/register">
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/pricing">Ver planos</Link>
                </Button>
              </div>
            </div>

            {/* Feature preview */}
            <div className="relative mt-16 rounded-xl overflow-hidden border border-border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-[20%] bottom-0"></div>
              <div className="bg-card p-4">
                <div className="bg-gradient-to-r from-medblue-700/20 to-medblue-900/30 rounded-lg h-[400px] md:h-[500px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-4">
                    <ChartBar className="h-16 w-16 mx-auto opacity-70" />
                    <div>
                      <p className="text-lg">Demonstração do Dashboard</p>
                      <p className="text-sm mt-2">Interface profissional com análise detalhada de pagamentos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Processo simples e eficiente para identificar valores glosados e recuperar pagamentos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-4 rounded-full mb-6">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Inteligente</h3>
                <p className="text-muted-foreground">
                  Faça o upload das guias médicas e demonstrativos de pagamento em formato PDF
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-4 rounded-full mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Análise Automática</h3>
                <p className="text-muted-foreground">
                  O sistema extrai e compara automaticamente os valores previstos vs. pagos
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-4 rounded-full mb-6">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Recuperação de Valores</h3>
                <p className="text-muted-foreground">
                  Identifique as glosas e tenha os dados necessários para recuperação dos valores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Recursos principais</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ferramentas profissionais para otimizar sua auditoria médica
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg mr-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Inteligente de PDFs</h3>
                  <p className="text-muted-foreground">
                    Upload fácil e rápido de guias médicas e demonstrativos de pagamento, com armazenamento seguro na nuvem.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg mr-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Extração e Comparação Automática</h3>
                  <p className="text-muted-foreground">
                    Visualização clara dos procedimentos, códigos CBHPM, valores previstos e pagos, com destaque para diferenças.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg mr-4">
                  <FileStack className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Histórico Completo</h3>
                  <p className="text-muted-foreground">
                    Acesso rápido ao histórico de análises organizadas cronologicamente, com exportação para Excel.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-6 glass-card rounded-xl">
                <div className="bg-primary/20 p-3 rounded-lg mr-4">
                  <ChartBar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Painel Visual com Gráficos</h3>
                  <p className="text-muted-foreground">
                    Visualize dados de pagamentos, glosas e recuperações através de gráficos intuitivos.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/register">
                  Criar conta gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section id="pricing" className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <PricingPlans 
              isLoggedIn={!!user} 
              isTrial={false} 
              onCheckout={handleCheckoutRedirect} 
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border py-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-gradient">MedCheck</span>
                </Link>
                <p className="mt-4 text-muted-foreground">
                  Auditoria médica automatizada para recuperação de valores glosados em procedimentos cirúrgicos.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Produto</h3>
                <ul className="space-y-3">
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Planos</Link></li>
                  <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Recursos</Link></li>
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground">Sobre nós</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Suporte</h3>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contato</Link></li>
                  <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Termos de serviço</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Política de privacidade</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 MedCheck. Todos os direitos reservados.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
