
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, AlertCircle, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ProceduresTab from "@/components/dashboard/tabs/ProceduresTab";

const DashboardPage = () => {
  return (
    <AuthenticatedLayout 
      title="Dashboard" 
      description="Visão geral de seus procedimentos e pagamentos"
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Recebido
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.597,00</div>
              <p className="text-xs text-muted-foreground">
                +8% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Glosado
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 1.438,00</div>
              <p className="text-xs text-muted-foreground">
                12% do valor total apresentado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procedimentos
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">
                Analisados nos últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Auditorias Pendentes
              </CardTitle>
              <FileBarChart className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Uploads aguardando sua revisão
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                Você recuperou R$ 2.450,00 este mês. Excelente!
              </p>
              <p className="text-sm text-muted-foreground">
                Continue acompanhando seus pagamentos para maximizar seus rendimentos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="procedimentos">
          <TabsList>
            <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
            <TabsTrigger value="glosas">Glosas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="procedimentos" className="pt-4">
            <ProceduresTab />
          </TabsContent>
          
          <TabsContent value="pagamentos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Procedimentos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">31170123 - Facectomia com LIO</div>
                        <Badge variant="success">Pago</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>R$ 983,45</span>
                        <span>21/04/2025</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">30912040 - Vitrectomia posterior</div>
                        <Badge variant="destructive">Glosado</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>R$ 0,00</span>
                        <span>19/04/2025</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">30809053 - Palpebra - reconstrução total</div>
                        <Badge variant="success">Pago</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>R$ 1.245,00</span>
                        <span>15/04/2025</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/guides">Ver todas as guias</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparativo de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Valor pago vs. CBHPM 2015</p>
                        <p className="text-xs text-muted-foreground">Média dos últimos 30 dias</p>
                      </div>
                      <div className="text-2xl font-bold text-success">92%</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cirurgião</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                        <div className="bg-success h-2 w-[95%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>1º Auxiliar</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                        <div className="bg-success h-2 w-[87%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>2º Auxiliar</span>
                        <span className="font-medium text-warning">78%</span>
                      </div>
                      <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                        <div className="bg-warning h-2 w-[78%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Anestesista</span>
                        <span className="font-medium text-destructive">68%</span>
                      </div>
                      <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                        <div className="bg-destructive h-2 w-[68%]"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/compare">Ver comparativo detalhado</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="glosas">
            <Card>
              <CardHeader>
                <CardTitle>Glosas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">30602246 - Reconstrução Mamária</div>
                      <Badge variant="destructive">R$ 1.063,68</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>Guia: 10467538</span>
                      <span>19/04/2025</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">Contestar</Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">30912040 - Vitrectomia posterior</div>
                      <Badge variant="destructive">R$ 242,44</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>Guia: 10467539</span>
                      <span>20/04/2025</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">Contestar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/glosas">Ver todas as glosas</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
