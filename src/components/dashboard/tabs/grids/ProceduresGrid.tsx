
import { Card } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { proceduresColumns } from "../columns/proceduresColumns";
import { Procedure } from "@/types/medical";

interface ProceduresGridProps {
  procedures: Procedure[];
}

export const ProceduresGrid = ({ procedures }: ProceduresGridProps) => {
  return (
    <Card>
      <DataGrid
        rows={procedures}
        columns={proceduresColumns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        className="min-h-[500px]"
      />
    </Card>
  );
};
