
import { useState } from "react";
import { ProceduresGrid } from "./grids/ProceduresGrid";
import { Procedure } from "@/types/medical";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Filter, BarChart2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados mock de exemplo para a demonstração
const mockProcedures: Procedure[] = [
  {
    id: "proc1",
    codigo: "30602246",
    procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    papel: "Cirurgião",
    valorCBHPM: 1521.32,
    valorPago: 457.64,
    diferenca: -1063.68,
    pago: true,
    guia: "10467538",
    beneficiario: "00620040000604690",
    doctors: [
      {
        code: "8425",
        name: "FERNANDA MABEL BATISTA",
        role: "Cirurgião",
        startTime: "2024-08-19T14:09:00",
        endTime: "2024-08-19T15:24:00",
        status: "Fechada"
      },
      {
        code: "6091",
        name: "MOISES DE OLIVEIRA",
        role: "Primeiro Auxiliar",
        startTime: "2024-08-19T14:15:00",
        endTime: "2024-08-19T15:17:00",
        status: "Fechada"
      }
    ]
  },
  {
    id: "proc2",
    codigo: "30912040",
    procedimento: "Vitrectomia posterior",
    papel: "Cirurgião",
    valorCBHPM: 1892.44,
    valorPago: 1650.00,
    diferenca: -242.44,
    pago: true,
    guia: "10467539",
    beneficiario: "00620040000604691",
    doctors: [
      {
        code: "8425",
        name: "FERNANDA MABEL BATISTA",
        role: "Cirurgião",
        startTime: "2024-08-20T10:00:00",
        endTime: "2024-08-20T11:30:00",
        status: "Fechada"
      }
    ]
  }
];

const ProceduresTab = () => {
  const [procedures] = useState<Procedure[]>(mockProcedures);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Procedimentos Médicos</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <BarChart2 className="w-4 h-4 mr-2" />
            Análise
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
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
              <ProceduresGrid procedures={procedures} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagos">
          <Card>
            <CardContent className="pt-6">
              <ProceduresGrid procedures={procedures.filter(p => p.pago)} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="glosados">
          <Card>
            <CardContent className="pt-6">
              <ProceduresGrid procedures={procedures.filter(p => !p.pago && p.diferenca < 0)} />
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
