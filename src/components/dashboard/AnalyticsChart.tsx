
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { name: 'Jan', recebido: 8400, glosado: 1200 },
  { name: 'Fev', recebido: 9200, glosado: 1600 },
  { name: 'Mar', recebido: 9800, glosado: 2100 },
  { name: 'Abr', recebido: 12200, glosado: 2400 },
];

export function AnalyticsChart() {
  return (
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
  );
}
