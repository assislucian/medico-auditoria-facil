
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { StatusCard } from "@/components/StatusCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Download, TrendingUp, Wallet, FileText, AlertCircle, Calendar, PieChart, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for charts
const monthlyData = [
  { name: 'Jan', recebido: 12400, glosado: 1800 },
  { name: 'Fev', recebido: 14200, glosado: 2100 },
  { name: 'Mar', recebido: 16800, glosado: 2400 },
  { name: 'Abr', recebido: 18200, glosado: 2900 },
  { name: 'Mai', recebido: 19600, glosado: 3200 },
  { name: 'Jun', recebido: 17800, glosado: 2700 },
];

const pieData = [
  { name: 'Recebido Corretamente', value: 68 },
  { name: 'Glosado', value: 22 },
  { name: 'Recuperado', value: 10 },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const hospitalData = [
  { name: 'Albert Einstein', procedimentos: 38, glosados: 12, recuperados: 8 },
  { name: 'Sírio-Libanês', procedimentos: 26, glosados: 8, recuperados: 4 },
  { name: 'Oswaldo Cruz', procedimentos: 22, glosados: 10, recuperados: 7 },
  { name: 'Beneficência Portuguesa', procedimentos: 18, glosados: 4, recuperados: 2 },
  { name: 'HCor', procedimentos: 12, glosados: 2, recuperados: 1 },
];

const ReportsPage = () => {
  return (
    <>
      <Helmet>
        <title>Relatórios | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <div className="flex gap-2">
              <Select defaultValue="2025">
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="default">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar Período
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="Total Recebido"
              value="R$ 98.720,00"
              icon={Wallet}
              trend={{ value: 12, isPositive: true }}
              description="Valor total recebido em 2025"
            />
            <StatusCard
              title="Total Glosado"
              value="R$ 14.430,00"
              icon={AlertCircle}
              trend={{ value: 8, isPositive: false }}
              className="border-red-500/20"
              description="Valor total glosado em 2025"
            />
            <StatusCard
              title="Total Recuperado"
              value="R$ 8.250,00"
              icon={TrendingUp}
              trend={{ value: 18, isPositive: true }}
              className="border-green-500/20"
              description="Valor recuperado após auditoria"
            />
            <StatusCard
              title="Procedimentos"
              value="142"
              icon={FileText}
              description="Total de procedimentos analisados"
            />
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="hospitals">Por Hospital</TabsTrigger>
              <TabsTrigger value="procedures">Por Procedimento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Valores Mensais</CardTitle>
                        <CardDescription>Valores recebidos e glosados ao longo do ano</CardDescription>
                      </div>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer config={{
                      recebido: {
                        label: "Recebido",
                        color: "#3b82f6",
                      },
                      glosado: {
                        label: "Glosado",
                        color: "#ef4444",
                      },
                    }} className="aspect-[4/3]">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis 
                            tickFormatter={(value) => `R$${value/1000}k`} 
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip content={(props) => (
                            <ChartTooltipContent
                              {...props}
                              formatter={(value) => `R$ ${value.toLocaleString()},00`}
                            />
                          )} 
                          />
                          <Bar dataKey="recebido" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="glosado" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Distribuição de Valores</CardTitle>
                        <CardDescription>Proporção entre valores recebidos, glosados e recuperados</CardDescription>
                      </div>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="hospitals">
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Hospital</CardTitle>
                  <CardDescription>Procedimentos e glosas por instituição</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium">Hospital</th>
                          <th className="pb-2 text-center font-medium">Procedimentos</th>
                          <th className="pb-2 text-center font-medium">Glosados</th>
                          <th className="pb-2 text-center font-medium">% Glosa</th>
                          <th className="pb-2 text-center font-medium">Recuperados</th>
                          <th className="pb-2 text-center font-medium">% Recuperação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hospitalData.map((hospital, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">{hospital.name}</td>
                            <td className="py-3 text-center">{hospital.procedimentos}</td>
                            <td className="py-3 text-center text-red-500 font-medium">{hospital.glosados}</td>
                            <td className="py-3 text-center">
                              {((hospital.glosados / hospital.procedimentos) * 100).toFixed(1)}%
                            </td>
                            <td className="py-3 text-center text-green-500 font-medium">{hospital.recuperados}</td>
                            <td className="py-3 text-center">
                              {((hospital.recuperados / hospital.glosados) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="procedures">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Análise por Procedimento</CardTitle>
                  <CardDescription>Detalhamento dos procedimentos mais realizados e suas respectivas taxas de glosa</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-12">
                    Esta funcionalidade será disponibilizada em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
