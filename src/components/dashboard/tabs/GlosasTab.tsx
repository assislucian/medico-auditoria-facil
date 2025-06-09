
import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { useState } from "react";

const GlosasTab = () => {
  const [glosas] = useState<any[]>([
    { 
      id: "gl1", 
      codigo: "G001",
      descricao: "Consulta médica em consultório",
      motivo: "Falta de documentação",
      valorGlosa: 150.00
    },
    { 
      id: "gl2", 
      codigo: "G002",
      descricao: "Procedimento cirúrgico",
      motivo: "Procedimento não autorizado",
      valorGlosa: 1250.00
    },
    { 
      id: "gl3", 
      codigo: "G003",
      descricao: "Exame laboratorial",
      motivo: "Divergência de valores",
      valorGlosa: 85.50
    }
  ]);  // Added some sample data to avoid errors

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
