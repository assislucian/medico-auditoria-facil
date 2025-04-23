
import { Button } from "@/components/ui/button";
import { Plus, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/history">
            <Plus className="mr-2 h-4 w-4" />
            Nova Auditoria
          </Link>
        </Button>
        <Button asChild>
          <Link to="/uploads">
            <UploadCloud className="mr-2 h-4 w-4" />
            Enviar Documentos
          </Link>
        </Button>
      </div>
    </div>
  );
}
