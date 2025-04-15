
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusCard } from '@/components/StatusCard';
import { ArrowUpRight, FileCheck, AlertTriangle, DollarSign, PieChart, BarChart3, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Monitore seus pagamentos, glosas e recuperações
          </p>
        </div>
        <Button asChild>
          <Link to="/uploads">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Novo Upload
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Recebido"
          value="R$ 15.750,00"
          icon={DollarSign}
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatusCard
          title="Valores Glosados"
          value="R$ 2.430,00"
          icon={AlertTriangle}
          trend={{
            value: 8,
            isPositive: false,
          }}
          className="border-destructive/20"
        />
        <StatusCard
          title="Valores Recuperados"
          value="R$ 1.840,00"
          icon={FileCheck}
          trend={{
            value: 24,
            isPositive: true,
          }}
          className="border-green-500/20"
        />
        <StatusCard
          title="Procedimentos"
          value="34"
          icon={Calendar}
          description="Últimos 30 dias"
        />
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="recent">Atividade Recente</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Distribuição de Valores</CardTitle>
                <CardDescription>
                  Comparativo entre valores recebidos, glosados e recuperados
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mb-4" />
                  <p>Gráfico de Pizza</p>
                  <p className="text-sm text-center mt-2">
                    (Dados reais serão renderizados com Recharts)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Histórico Mensal</CardTitle>
                <CardDescription>
                  Evolução de pagamentos e glosas nos últimos meses
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mb-4" />
                  <p>Gráfico de Barras</p>
                  <p className="text-sm text-center mt-2">
                    (Dados reais serão renderizados com Recharts)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Atividades Recentes</CardTitle>
              <CardDescription>
                Seus últimos uploads e análises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-4 mt-0.5 p-2 bg-primary/10 rounded-full">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Análise de demonstrativo concluída
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {`Foram identificadas ${3 - i} glosas no demonstrativo de ${i + 8}/04/2025`}
                      </p>
                      <div className="flex items-center pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/history/123">Ver detalhes</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {`${i + 1}d atrás`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
