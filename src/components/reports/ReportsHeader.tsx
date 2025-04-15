
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>
      <div className="flex gap-2">
        <Select defaultValue="2025">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="default">
          <Calendar className="mr-2 h-4 w-4" />
          Filtrar Período
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
}
