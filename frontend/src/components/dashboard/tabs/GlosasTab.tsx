import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { useState } from "react";

interface GlosasTabProps {
  glosas?: any[];
}

const GlosasTab = ({ glosas }: GlosasTabProps) => {
  const data = glosas && glosas.length > 0 ? glosas : [];
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
        if (params.value === undefined || params.value === null) {
          return 'R$ 0,00';
        }
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
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        className="min-h-[500px]"
      />
      {data.length === 0 && <div className="text-center text-muted-foreground py-8">Nenhuma glosa encontrada nos últimos 30 dias.</div>}
    </Card>
  );
};

export default GlosasTab;
