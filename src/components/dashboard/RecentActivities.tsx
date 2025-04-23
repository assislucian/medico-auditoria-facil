
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimos uploads e análises</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-secondary">
              <FileText className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Hospital Albert Einstein - Abril 2025</p>
              <p className="text-xs text-muted-foreground">Análise concluída hoje</p>
              <div className="flex gap-2 mt-1">
                <div className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">8 procedimentos</div>
                <div className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">3 glosas</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-secondary">
              <UploadCloud className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Hospital Sírio-Libanês - Março 2025</p>
              <p className="text-xs text-muted-foreground">Documentos enviados ontem</p>
              <div className="flex gap-2 mt-1">
                <div className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">Pendente</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-secondary">
              <AlertCircle className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Hospital Oswaldo Cruz - Março 2025</p>
              <p className="text-xs text-muted-foreground">5 dias atrás</p>
              <div className="flex gap-2 mt-1">
                <div className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">12 procedimentos</div>
                <div className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">7 glosas</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Link to="/history">
              <Button variant="outline" size="sm">Ver histórico completo</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
