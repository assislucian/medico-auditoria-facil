import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, FileX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ResourceDialog } from "@/components/unpaid-procedures/ResourceDialog";

// Dados mock de exemplo para a demonstração
const mockUnpaidProcedures = [
  { 
    id: "up1", 
    guia: "10467538", 
    procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    data: "19/04/2025", 
    valorApresentado: 1063.68, 
    motivoNaoPagamento: "Procedimento em auditoria",
    status: "Pendente" 
  },
  { 
    id: "up2", 
    guia: "10467539", 
    procedimento: "Vitrectomia posterior",
    data: "20/04/2025", 
    valorApresentado: 892.44, 
    motivoNaoPagamento: "Documentação incompleta",
    status: "Em recurso" 
  },
  { 
    id: "up3", 
    guia: "10467540", 
    procedimento: "Palpebra - reconstrução total",
    data: "21/04/2025", 
    valorApresentado: 629.75, 
    motivoNaoPagamento: "Procedimento não coberto",
    status: "Negado" 
  }
];

const unpaidColumns = [
  { field: 'guia', headerName: 'Nº Guia', width: 120 },
  { field: 'procedimento', headerName: 'Procedimento', flex: 1 },
  { field: 'data', headerName: 'Data', width: 120 },
  { 
    field: 'valorApresentado', 
    headerName: 'Valor Apresentado', 
    width: 150,
    valueFormatter: (params: any) => {
      if (params.value === undefined || params.value === null) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { 
    field: 'motivoNaoPagamento', 
    headerName: 'Motivo', 
    width: 200,
    renderCell: ({ value }: { value: string }) => (
      <Badge variant="destructive" className="bg-red-500/10">
        {value}
      </Badge>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: ({ value }: { value: string }) => {
      const variant = 
        value === "Pendente" ? "warning" : 
        value === "Em recurso" ? "outline" : 
        "destructive";
      
      return <Badge variant={variant}>{value}</Badge>;
    }
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 120,
    renderCell: ({ row }: { row: any }) => (
      <ResourceDialog procedure={row} />
    )
  }
];

const UnpaidProceduresPage = () => {
  const [unpaidProcedures] = useState<any[]>(mockUnpaidProcedures);

  return (
    <AuthenticatedLayout title="Procedimentos Não Pagos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Card className="flex-1 mr-4 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex items-center">
              <div className="bg-amber-500/10 p-2 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-medium">
                  Existem {unpaidProcedures.filter(p => p.status !== "Negado").length} procedimentos que podem ser contestados
                </p>
                <p className="text-sm text-muted-foreground">
                  Conteste em até 30 dias para garantir a análise pelo convênio
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileX className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Lista de Procedimentos Não Pagos</h3>
            </div>
          </CardHeader>
          <CardContent>
            <DataGrid
              rows={unpaidProcedures}
              columns={unpaidColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              className="min-h-[500px]"
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default UnpaidProceduresPage;
