
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Dados mock de exemplo para a demonstração
const mockGlosas = [
  { 
    id: "gl1", 
    guia: "10467538", 
    procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    data: "19/04/2025", 
    valorGlosado: 1063.68, 
    motivoGlosa: "Procedimento em auditoria",
    contestada: false 
  },
  { 
    id: "gl2", 
    guia: "10467539", 
    procedimento: "Vitrectomia posterior",
    data: "20/04/2025", 
    valorGlosado: 892.44, 
    motivoGlosa: "Documentação incompleta",
    contestada: true 
  },
  { 
    id: "gl3", 
    guia: "10467540", 
    procedimento: "Palpebra - reconstrução total",
    data: "21/04/2025", 
    valorGlosado: 629.75, 
    motivoGlosa: "Procedimento não coberto",
    contestada: false 
  }
];

const glosaColumns = [
  { field: 'guia', headerName: 'Nº Guia', width: 120 },
  { field: 'procedimento', headerName: 'Procedimento', flex: 1 },
  { field: 'data', headerName: 'Data', width: 120 },
  { 
    field: 'valorGlosado', 
    headerName: 'Valor Glosado', 
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
  { field: 'motivoGlosa', headerName: 'Motivo', width: 200 },
  { 
    field: 'contestada', 
    headerName: 'Status', 
    width: 150,
    renderCell: ({ value }: { value: boolean }) => {
      return value ? 
        <Badge variant="warning">Contestada</Badge> : 
        <Badge variant="destructive">Não Contestada</Badge>;
    }
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 120,
    renderCell: ({ row }: { row: any }) => {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          disabled={row.contestada}
        >
          Contestar
        </Button>
      );
    }
  }
];

const GlosasPage = () => {
  const [glosas] = useState<any[]>(mockGlosas);

  return (
    <AuthenticatedLayout 
      title="Glosas" 
      description="Analise e conteste as glosas dos planos de saúde"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Gestão de Glosas</h2>
            <p className="text-muted-foreground">
              Conteste glosas e recupere valores perdidos
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Relatório
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-500/10 p-2 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="font-medium">
                Existem 2 glosas não contestadas que podem ser recuperadas!
              </p>
              <p className="text-sm text-muted-foreground">
                Conteste em até 30 dias para garantir a análise pelo convênio.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <AlertCircle className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium">Procedimentos Glosados</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataGrid
              rows={glosas}
              columns={glosaColumns}
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

export default GlosasPage;
