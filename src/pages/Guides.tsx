
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { useState } from "react";

const guidesColumns = [
  { field: 'numero', headerName: 'Nº Guia', width: 150 },
  { field: 'paciente', headerName: 'Paciente', flex: 1 },
  { field: 'data', headerName: 'Data', width: 120 },
  { field: 'qtdItens', headerName: 'Qty Itens', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 }
];

const GuidesPage = () => {
  const [guides] = useState<any[]>([]);

  return (
    <AuthenticatedLayout 
      title="Guias Médicas" 
      description="Visualize e gerencie suas guias médicas"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
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
