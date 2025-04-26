
import { formatCurrency } from "@/utils/formatters";
import { PaymentStatement } from "@/types/medical";

interface ColumnParams {
  value: any;
  row: PaymentStatement;
}

export const paymentStatementsColumns = [
  { field: 'codigo', headerName: 'Código', width: 120 },
  { field: 'descricao', headerName: 'Descrição', flex: 1 },
  { field: 'funcao', headerName: 'Função', width: 120 },
  { 
    field: 'valorPago', 
    headerName: 'Valor Pago', 
    width: 130,
    type: 'number',
    valueFormatter: (params: ColumnParams) => formatCurrency(params.value)
  },
  { 
    field: 'valorTabela2015', 
    headerName: 'Valor 2015', 
    width: 130,
    type: 'number',
    valueFormatter: (params: ColumnParams) => formatCurrency(params.value)
  },
  { 
    field: 'diferenca', 
    headerName: 'Δ%', 
    width: 100,
    type: 'number',
    renderCell: (params: ColumnParams) => {
      const value = params.value;
      let className = value >= 0 ? 'text-green-600' : 
                     value > -10 ? 'text-orange-500' : 
                     'text-red-600';
      return (
        <div className={className}>
          {value.toFixed(1)}%
        </div>
      );
    }
  }
];
