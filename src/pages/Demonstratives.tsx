
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { useState } from "react";

const demonstrativesColumns = [
  { field: 'periodo', headerName: 'Período', width: 150 },
  { field: 'lote', headerName: 'Lote', width: 120 },
  { field: 'totalApresentado', headerName: 'Total Apresentado', width: 150,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalLiberado', headerName: 'Total Liberado', width: 150,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalGlosa', headerName: 'Total Glosa', width: 150,
    valueFormatter: (params: any) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  }
];

const DemonstrativesPage = () => {
  const [demonstratives] = useState<any[]>([]);

  return (
    <AuthenticatedLayout 
      title="Demonstrativos" 
      description="Visualize e gerencie seus demonstrativos de pagamento"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
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
