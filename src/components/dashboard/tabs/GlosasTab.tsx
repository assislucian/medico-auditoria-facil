
import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { useState } from "react";

const GlosasTab = () => {
  const [glosas] = useState<any[]>([]);  // We'll integrate this with real data later

  const columns = [
    { field: 'codigo', headerName: 'Código', width: 120 },
    { field: 'descricao', headerName: 'Descrição', flex: 1 },
    { field: 'motivo', headerName: 'Motivo', width: 200 },
    { 
      field: 'valorGlosa', 
      headerName: 'Valor Glosa', 
      width: 130,
      type: 'number',
      valueFormatter: (params: any) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(params.value);
      }
    }
  ];

  return (
    <Card>
      <DataGrid
        rows={glosas}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        className="min-h-[500px]"
      />
    </Card>
  );
};

export default GlosasTab;
