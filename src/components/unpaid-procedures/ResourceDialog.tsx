
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/format";

interface ResourceDialogProps {
  procedure: {
    guia: string;
    procedimento: string;
    dataExecucao?: string;
    valorApresentado: number;
    motivoNaoPagamento: string;
    status: string;
  };
}

export function ResourceDialog({ procedure }: ResourceDialogProps) {
  const { user, userProfile } = useAuth();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={procedure.status === "Negado"}
        >
          <FileText className="h-4 w-4" />
          Contestar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Formulário de Recurso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid gap-4 border-b pb-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Informações do Procedimento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Guia</p>
                  <p className="font-medium">{procedure.guia}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CRM Médico</p>
                  <p className="font-medium">{userProfile?.crm || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Procedimento</p>
                <p className="font-medium">{procedure.procedimento}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Motivo do Não Pagamento</p>
                <Badge variant="destructive" className="mt-1">
                  {procedure.motivoNaoPagamento}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Valor Apresentado</p>
                <p className="font-medium text-lg text-primary">
                  {formatCurrency(procedure.valorApresentado)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Button className="w-full" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Documento de Recurso
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
