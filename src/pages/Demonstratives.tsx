
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download, Filter } from "lucide-react";
import { useState } from "react";

// Dados mock de exemplo para a demonstração
const mockDemonstratives = [
  { 
    id: "d1", 
    periodo: "Agosto/2024", 
    lote: "L-2024-001", 
    totalApresentado: 4500.75, 
    totalLiberado: 3980.50, 
    totalGlosa: 520.25 
  },
  { 
    id: "d2", 
    periodo: "Julho/2024", 
    lote: "L-2024-026", 
    totalApresentado: 6200.00, 
    totalLiberado: 5850.30, 
    totalGlosa: 349.70 
  },
  { 
    id: "d3", 
    periodo: "Junho/2024", 
    lote: "L-2024-015", 
    totalApresentado: 5320.50, 
    totalLiberado: 4980.00, 
    totalGlosa: 340.50 
  }
];

const demonstrativesColumns = [
  { field: 'periodo', headerName: 'Período', width: 150 },
  { field: 'lote', headerName: 'Lote', width: 120 },
  { field: 'totalApresentado', headerName: 'Total Apresentado', width: 180,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalLiberado', headerName: 'Total Liberado', width: 180,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalGlosa', headerName: 'Total Glosa', width: 180,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  }
];

const DemonstrativesPage = () => {
  const [demonstratives] = useState<any[]>(mockDemonstratives);

  return (
    <AuthenticatedLayout 
      title="Demonstrativos" 
      description="Visualize e gerencie seus demonstrativos de pagamento"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Demonstrativos</h2>
            <p className="text-muted-foreground">
              Acompanhe seus demonstrativos de pagamento
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <FileBarChart className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium">Demonstrativos de Pagamento</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataGrid
              rows={demonstratives}
              columns={demonstrativesColumns}
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

export default DemonstrativesPage;
