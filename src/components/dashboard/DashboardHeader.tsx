
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button asChild>
        <Link to="/uploads">
          <UploadCloud className="mr-2 h-4 w-4" />
          Enviar Documentos
        </Link>
      </Button>
    </div>
  );
}
