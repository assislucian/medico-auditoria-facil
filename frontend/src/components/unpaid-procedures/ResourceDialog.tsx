import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FilePlus, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/format";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [glosaDescricao, setGlosaDescricao] = useState<string | null>(null);
  
  useEffect(() => {
    // Tenta extrair código da glosa do motivo ou procedimento
    const codigoMatch = (procedure.motivoNaoPagamento || '').match(/\b\d{4}\b/);
    const codigo = codigoMatch ? codigoMatch[0] : null;
    if (!codigo) {
      setGlosaDescricao(null);
      return;
    }
    // Cache simples em memória
    const cacheKey = `glosa_${codigo}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setGlosaDescricao(cached);
      return;
    }
    // Busca na knowledge base
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/glosas?codigo=${codigo}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGlosaDescricao(data[0].descricao);
          sessionStorage.setItem(cacheKey, data[0].descricao);
        } else {
          setGlosaDescricao(null);
        }
      })
      .catch(() => setGlosaDescricao(null));
  }, [procedure.motivoNaoPagamento, procedure.procedimento]);
  
  const handleGenerateResource = async () => {
    setIsGenerating(true);
    
    // Simulação de geração do documento
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Documento de recurso gerado com sucesso!");
      
      // Aqui seria implementada a lógica real de geração do PDF com o CRM do médico
      console.log(`Gerando recurso para o procedimento ${procedure.guia} usando o CRM ${userProfile?.crm}`);
      
      // Simulação de download
      const link = document.createElement("a");
      link.href = "#";
      link.download = `recurso-${procedure.guia}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Erro ao gerar recurso:", error);
      toast.error("Erro ao gerar documento. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };
  
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
                {glosaDescricao && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs">
                    <strong>Explicação oficial:</strong> {glosaDescricao}
                  </div>
                )}
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
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleGenerateResource}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <FilePlus className="h-4 w-4 mr-2 animate-pulse" />
                  Gerando Documento...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar e Baixar Documento de Recurso
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              O documento será gerado com o CRM {userProfile?.crm || "[não informado]"} e estará pronto para envio à operadora.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
