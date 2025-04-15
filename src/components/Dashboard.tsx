
import { StatusCard } from "@/components/StatusCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonView from "@/components/ComparisonView";
import { BarChart2, UploadCloud, AlertCircle, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', recebido: 8400, glosado: 1200 },
  { name: 'Fev', recebido: 9200, glosado: 1600 },
  { name: 'Mar', recebido: 9800, glosado: 2100 },
  { name: 'Abr', recebido: 12200, glosado: 2400 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/uploads">
            <UploadCloud className="mr-2 h-4 w-4" />
            Enviar Documentos
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total Recebido"
          value="R$ 39.600,00"
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          description="Pagamentos recebidos em 2025"
        />
        <StatusCard
          title="Total Glosado"
          value="R$ 7.300,00"
          icon={AlertCircle}
          trend={{ value: 12, isPositive: false }}
          className="border-red-500/20"
          description="Valor total glosado em 2025"
        />
        <StatusCard
          title="Procedimentos"
          value="86"
          icon={FileText}
          description="Total de procedimentos analisados"
        />
        <StatusCard
          title="Auditorias Pendentes"
          value="2"
          icon={Clock}
          className="border-amber-500/20"
          description="Uploads pendentes de análise"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Análises Recentes</CardTitle>
                <CardDescription>Valores recebidos e glosados por mês</CardDescription>
              </div>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`R$ ${value},00`, undefined]} />
                  <Bar dataKey="recebido" name="Recebido" fill="#1E40AF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="glosado" name="Glosado" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimos uploads e análises</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hospital Albert Einstein - Abril 2025</p>
                  <p className="text-xs text-muted-foreground">Análise concluída hoje</p>
                  <div className="flex gap-2 mt-1">
                    <div className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">8 procedimentos</div>
                    <div className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">3 glosas</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <UploadCloud className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hospital Sírio-Libanês - Março 2025</p>
                  <p className="text-xs text-muted-foreground">Documentos enviados ontem</p>
                  <div className="flex gap-2 mt-1">
                    <div className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">Pendente</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-secondary">
                  <AlertCircle className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hospital Oswaldo Cruz - Março 2025</p>
                  <p className="text-xs text-muted-foreground">5 dias atrás</p>
                  <div className="flex gap-2 mt-1">
                    <div className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">12 procedimentos</div>
                    <div className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">7 glosas</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link to="/history">
                  <Button variant="outline" size="sm">Ver histórico completo</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="pt-4">
        <ComparisonView />
      </div>
    </div>
  );
};

export default Dashboard;
