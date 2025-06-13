import { useState } from "react";
import { ProceduresGrid } from "./grids/ProceduresGrid";
import { Procedure } from "@/types/medical";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Filter, BarChart2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProceduresTabProps {
  procedures?: Procedure[];
}

const ProceduresTab = ({ procedures }: ProceduresTabProps) => {
  const data = procedures && procedures.length > 0 ? procedures : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Procedimentos Médicos</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="w-4 h-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4 mr-1" />
            Análise
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="glosados">Glosados</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos">
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium">Lista de Procedimentos</span>
              </div>
            </CardHeader>
            <CardContent>
              <ProceduresGrid procedures={data} />
              {data.length === 0 && <div className="text-center text-muted-foreground py-8">Nenhum procedimento encontrado nos últimos 30 dias.</div>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagos">
          <Card>
            <CardContent className="pt-6">
              <ProceduresGrid procedures={data.filter(p => p.pago)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="glosados">
          <Card>
            <CardContent className="pt-6">
              <ProceduresGrid procedures={data.filter(p => !p.pago && p.diferenca < 0)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pendentes">
          <Card>
            <CardContent className="pt-6">
              <ProceduresGrid procedures={[]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProceduresTab;
