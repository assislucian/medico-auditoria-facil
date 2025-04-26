
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";

// Dados mock de exemplo para a demonstração
const mockGuides = [
  { 
    id: "g1", 
    numero: "10467538", 
    paciente: "Maria Silva", 
    data: "19/04/2025", 
    qtdItens: 3, 
    status: "Fechada" 
  },
  { 
    id: "g2", 
    numero: "10467539", 
    paciente: "João Pereira", 
    data: "20/04/2025", 
    qtdItens: 1, 
    status: "Pendente" 
  },
  { 
    id: "g3", 
    numero: "10467540", 
    paciente: "Ana Souza", 
    data: "21/04/2025", 
    qtdItens: 2, 
    status: "Glosada" 
  },
];

const guidesColumns = [
  { field: 'numero', headerName: 'Nº Guia', width: 150 },
  { field: 'paciente', headerName: 'Paciente', flex: 1 },
  { field: 'data', headerName: 'Data', width: 120 },
  { field: 'qtdItens', headerName: 'Qty Itens', width: 100 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: ({ value }) => {
      let variant: "default" | "success" | "warning" | "destructive" = "default";
      
      if (value === "Fechada") variant = "success";
      if (value === "Pendente") variant = "warning";
      if (value === "Glosada") variant = "destructive";
      
      return <Badge variant={variant}>{value}</Badge>;
    }
  }
];

const GuidesPage = () => {
  const [guides] = useState<any[]>(mockGuides);

  return (
    <AuthenticatedLayout 
      title="Guias Médicas" 
      description="Visualize e gerencie suas guias médicas"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Guias Médicas</h2>
            <p className="text-muted-foreground">
              Acompanhe e gerencie suas guias médicas
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Guia
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <FileText className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium">Guias Médicas</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataGrid
              rows={guides}
              columns={guidesColumns}
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

export default GuidesPage;
