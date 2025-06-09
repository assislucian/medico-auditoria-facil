
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Filter, 
  AlertTriangle, 
  Check, 
  FileX,
  MessageSquareX
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UnpaidProcedureDetailDialog } from "@/components/unpaid-procedures/UnpaidProcedureDetailDialog";
import { ContestationDialog } from "@/components/contestation/ContestationDialog";
import { fetchUnpaidProcedures } from "@/services/unpaidProceduresService";
import { formatCurrency } from "@/utils/format";

// Types
interface UnpaidProcedure {
  id: string;
  guia: string;
  dataExecucao: string;
  codigoProcedimento: string;
  descricaoProcedimento: string;
  beneficiario: string;
  prestador: string;
  papel: string;
  valorCBHPM: number;
  valorPago: number;
  diferenca: number;
  motivoGlosa?: string;
  tipo: 'glosa' | 'nao_pago';
  status: 'pendente' | 'contestado' | 'recuperado';
  doctors?: any[];
}

const UnpaidProceduresPage = () => {
  const [procedures, setProcedures] = useState<UnpaidProcedure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProcedure, setSelectedProcedure] = useState<UnpaidProcedure | null>(null);
  const [contestationOpen, setContestationOpen] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchUnpaidProcedures();
        setProcedures(data);
      } catch (error) {
        console.error("Error loading unpaid procedures:", error);
        toast.error("Erro ao carregar procedimentos não pagos");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter procedures based on active tab
  const filteredProcedures = procedures.filter(proc => {
    if (activeTab === "all") return true;
    if (activeTab === "glosas") return proc.tipo === 'glosa';
    if (activeTab === "nao_pagos") return proc.tipo === 'nao_pago';
    if (activeTab === "pendentes") return proc.status === 'pendente';
    if (activeTab === "contestados") return proc.status === 'contestado';
    return true;
  });

  // Stats calculation
  const stats = {
    total: procedures.length,
    glosas: procedures.filter(p => p.tipo === 'glosa').length,
    naoPagos: procedures.filter(p => p.tipo === 'nao_pago').length,
    valorTotal: procedures.reduce((sum, p) => sum + p.diferenca, 0),
    pendentes: procedures.filter(p => p.status === 'pendente').length,
    contestados: procedures.filter(p => p.status === 'contestado').length
  };

  const handleContestation = (procedure: UnpaidProcedure) => {
    setSelectedProcedure(procedure);
    setContestationOpen(true);
  };
  
  // Column definition for the procedures table
  const proceduresColumns = [
    { field: 'guia', headerName: 'Guia', width: 100 },
    { field: 'dataExecucao', headerName: 'Data', width: 100 },
    { field: 'codigoProcedimento', headerName: 'Código', width: 100 },
    { field: 'descricaoProcedimento', headerName: 'Procedimento', flex: 1 },
    { 
      field: 'tipo', 
      headerName: 'Tipo', 
      width: 120,
      renderCell: ({ value }) => (
        <Badge variant={value === "glosa" ? "destructive" : "secondary"}>
          {value === "glosa" ? "Glosa" : "Não Pago"}
        </Badge>
      )
    },
    { 
      field: 'valorCBHPM', 
      headerName: 'Valor CBHPM', 
      width: 120,
      valueFormatter: (params) => formatCurrency(params.value)
    },
    { 
      field: 'valorPago', 
      headerName: 'Valor Pago', 
      width: 120,
      valueFormatter: (params) => formatCurrency(params.value)
    },
    { 
      field: 'diferenca', 
      headerName: 'Diferença', 
      width: 120,
      renderCell: ({ value }) => (
        <span className="font-medium text-red-600">
          {formatCurrency(Math.abs(value))}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: ({ value }) => {
        const variant = 
          value === "pendente" ? "warning" : 
          value === "contestado" ? "secondary" : 
          value === "recuperado" ? "success" : "default";
        
        return <Badge variant={variant}>{
          value === "pendente" ? "Pendente" : 
          value === "contestado" ? "Contestado" : 
          value === "recuperado" ? "Recuperado" : value
        }</Badge>;
      }
    },
    { 
      field: 'actions', 
      headerName: 'Ações', 
      width: 240,
      renderCell: ({ row }) => (
        <div className="flex space-x-2">
          <UnpaidProcedureDetailDialog procedure={row} />
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleContestation(row)}
          >
            <MessageSquareX className="h-4 w-4" />
            <span>Contestar</span>
          </Button>
        </div>
      )
    }
  ];

  return (
    <AuthenticatedLayout 
      title="Procedimentos Não Pagos" 
      description="Visualize e conteste procedimentos não pagos ou glosados"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Procedimentos Não Pagos e Glosas</h2>
            <p className="text-muted-foreground">
              Identifique e conteste procedimentos não pagos ou glosados
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm text-muted-foreground">Total Procedimentos</div>
                <div className="font-medium text-xl">{stats.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <FileX className="h-8 w-8 text-red-600 mb-2" />
                <div className="text-sm text-muted-foreground">Glosas</div>
                <div className="font-medium text-xl">{stats.glosas}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-2" />
                <div className="text-sm text-muted-foreground">Não Pagos</div>
                <div className="font-medium text-xl">{stats.naoPagos}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Check className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-sm text-muted-foreground">Valor Potencial</div>
                <div className="font-medium text-xl">{formatCurrency(stats.valorTotal)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <MessageSquareX className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm text-muted-foreground">Contestados</div>
                <div className="font-medium text-xl">{stats.contestados}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
            <TabsTrigger value="glosas">Glosas ({stats.glosas})</TabsTrigger>
            <TabsTrigger value="nao_pagos">Não Pagos ({stats.naoPagos})</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes ({stats.pendentes})</TabsTrigger>
            <TabsTrigger value="contestados">Contestados ({stats.contestados})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {activeTab === "all" ? "Todos os Procedimentos" :
                       activeTab === "glosas" ? "Procedimentos Glosados" :
                       activeTab === "nao_pagos" ? "Procedimentos Não Pagos" :
                       activeTab === "pendentes" ? "Procedimentos Pendentes" :
                       "Procedimentos Contestados"}
                    </CardTitle>
                    <CardDescription>
                      {filteredProcedures.length} procedimentos encontrados
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataGrid
                  rows={filteredProcedures}
                  columns={proceduresColumns}
                  pageSize={10}
                  className="min-h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contestation Dialog */}
      {selectedProcedure && (
        <ContestationDialog
          open={contestationOpen}
          onOpenChange={setContestationOpen}
          procedureDetails={{
            codigo: selectedProcedure.codigoProcedimento,
            procedimento: selectedProcedure.descricaoProcedimento,
            valorCBHPM: selectedProcedure.valorCBHPM,
            valorPago: selectedProcedure.valorPago,
            diferenca: selectedProcedure.diferenca,
            papel: selectedProcedure.papel,
            justificativa: selectedProcedure.motivoGlosa
          }}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default UnpaidProceduresPage;
