
import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { paymentStatementsColumns } from "../columns/paymentStatementsColumns";
import { PaymentStatement } from "@/types/medical";

interface PaymentStatementsGridProps {
  payments: PaymentStatement[];
}

export const PaymentStatementsGrid = ({ payments }: PaymentStatementsGridProps) => {
  return (
    <Card>
      <DataGrid
        rows={payments}
        columns={paymentStatementsColumns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        className="min-h-[500px]"
      />
    </Card>
  );
};
