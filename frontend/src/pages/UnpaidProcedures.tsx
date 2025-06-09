import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { DataGrid } from "../components/ui/data-grid";
import { Button } from "../components/ui/button";
import { AlertCircle, Download, FileX, Filter, Loader2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useState, useEffect } from "react";
import { ResourceDialog } from "../components/unpaid-procedures/ResourceDialog";
import { formatCurrency } from "../utils/format";
import PageHeader from "../components/layout/PageHeader";
import { useAuth } from "../contexts/auth/AuthContext";
import { UserMenu } from "../components/navbar/UserMenu";
import InfoCard from "../components/ui/InfoCard";
import axios from "axios";

const unpaidColumns = [
  { field: 'guia', headerName: 'Nº Guia', width: 120 },
  { field: 'procedimento', headerName: 'Procedimento', flex: 1 },
  { field: 'data', headerName: 'Data', width: 120 },
  { 
    field: 'valorApresentado', 
    headerName: 'Valor Apresentado', 
    width: 150,
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'motivoNaoPagamento', 
    headerName: 'Motivo', 
    width: 200,
    renderCell: ({ value }: { value: string }) => (
      <Badge variant="danger">
        {value}
      </Badge>
    )
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: ({ value }: { value: string }) => {
      const variant = 
        value === "Pendente" ? "warning" : 
        value === "Em recurso" ? "outline" : 
        "destructive";
      
      return <Badge variant={variant}>{value}</Badge>;
    }
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 120,
    renderCell: ({ row }: { row: any }) => (
      <ResourceDialog procedure={row} />
    )
  }
];

const UnpaidProceduresPage = () => {
  const [unpaidProcedures, setUnpaidProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile, signOut } = useAuth();

  useEffect(() => {
    const fetchUnpaidProcedures = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        // 1. Buscar todos os demonstrativos
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/demonstrativos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const demonstrativos = res.data || [];
        // 2. Buscar detalhes de cada demonstrativo (em paralelo)
        const detalhesAll = await Promise.all(
          demonstrativos.map(async (d: any) => {
            try {
              const resDetalhes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/demonstrativos/${d.id}/detalhes`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return resDetalhes.data || [];
            } catch {
              return [];
            }
          })
        );
        // 3. Filtrar procedimentos glosados
        const glosados = detalhesAll.flat().filter((p: any) => {
          const glosa = Number(p.financial?.glosa ?? p.glosa) || 0;
          return glosa > 0;
        });
        // 4. Mapear para o formato esperado pela tabela/dialog
        const mapped = glosados.map((p: any, idx: number) => ({
          id: idx,
          guia: p.guia ?? p.guide ?? '',
          procedimento: p.descricao ?? p.description ?? '',
          data: p.data ?? p.date ?? '',
          valorApresentado: Number(p.financial?.presented_value ?? p.apresentado) || 0,
          motivoNaoPagamento: p.motivo_glosa ?? p.motivoNaoPagamento ?? p.motivo ?? 'Glosa',
          status: 'Pendente', // Pode ser melhorado se backend fornecer status
        }));
        setUnpaidProcedures(mapped);
      } catch (err) {
        setError('Erro ao carregar procedimentos não pagos.');
        setUnpaidProcedures([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUnpaidProcedures();
  }, []);

  return (
    <AuthenticatedLayout title="Procedimentos Não Pagos">
      <PageHeader
        title="Procedimentos Não Pagos"
        icon={<FileX size={28} />}
        actions={userProfile ? (
          <UserMenu
            name={userProfile.name || 'Usuário'}
            email={userProfile.email || 'sem-email@exemplo.com'}
            specialty={userProfile.crm || ''}
            avatarUrl={userProfile.avatarUrl || undefined}
            onLogout={signOut}
          />
        ) : null}
      />
      <div className="space-y-6">
        <InfoCard
          icon={<AlertCircle className="h-6 w-6 text-amber-500" />}
          title={`Existem ${unpaidProcedures.length} procedimentos que podem ser contestados`}
          description="Conteste em até 30 dias para garantir a análise pelo convênio"
          variant="warning"
          className="w-full mb-4"
        />
        
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileX className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Lista de Procedimentos Não Pagos</h3>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" aria-label="Carregando..." />
                <span className="ml-3 text-blue-600 font-medium">Carregando procedimentos...</span>
              </div>
            ) : error ? (
              <div className="text-danger font-medium p-4">{error}</div>
            ) : (
              <DataGrid
                rows={unpaidProcedures}
                columns={unpaidColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                className="min-h-[500px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default UnpaidProceduresPage;
