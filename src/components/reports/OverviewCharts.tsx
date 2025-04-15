
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Legend } from "recharts";
import { BarChart2, PieChart } from "lucide-react";
import { monthlyData, pieData, COLORS } from "./data";

export function OverviewCharts() {
  return (
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
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()},00`, undefined]}
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
  );
}
