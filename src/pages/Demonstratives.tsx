import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { 
  FileBarChart, 
  Download, 
  Filter, 
  Upload, 
  Eye, 
  ChevronRight,
  Calendar,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileDropZone from "@/components/upload/FileDropZone";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileType } from "@/types/upload";
import FileList from "@/components/upload/FileList";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const mockDemonstratives = [
  { 
    id: "d1", 
    periodo: "Outubro/2024", 
    lote: "1608", 
    hospital: "Liga Norteriog Cancer Policlinic",
    procedimentosTotal: 32,
    totalApresentado: 7324.90, 
    totalLiberado: 7157.22, 
    totalGlosa: 167.68,
    consultasQtd: 21, 
    consultasValor: 1785.00,
    honorariosQtd: 11, 
    honorariosValor: 5539.90 
  },
  { 
    id: "d2", 
    periodo: "Setembro/2024", 
    lote: "1592", 
    hospital: "Liga Norteriog Cancer Policlinic",
    procedimentosTotal: 28,
    totalApresentado: 6200.00, 
    totalLiberado: 5850.30, 
    totalGlosa: 349.70,
    consultasQtd: 18, 
    consultasValor: 1530.00,
    honorariosQtd: 10, 
    honorariosValor: 4670.00 
  },
  { 
    id: "d3", 
    periodo: "Agosto/2024", 
    lote: "1573", 
    hospital: "Liga Norteriog Cancer Policlinic",
    procedimentosTotal: 24,
    totalApresentado: 5320.50, 
    totalLiberado: 4980.00, 
    totalGlosa: 340.50,
    consultasQtd: 16, 
    consultasValor: 1360.00,
    honorariosQtd: 8, 
    honorariosValor: 3960.50 
  }
];

const mockDetailedProcedures = [
  {
    id: "p1",
    guia: "10467538",
    data: "19/08/2024",
    carteira: "00620040000604690",
    paciente: "THAYSE BORGES",
    codigo: "30602246",
    descricao: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    quantidade: 1,
    apresentado: 457.64,
    liberado: 457.64,
    glosa: 0.00
  },
  {
    id: "p2",
    guia: "10467538",
    data: "19/08/2024",
    carteira: "00620040000604690",
    paciente: "THAYSE BORGES",
    codigo: "30602203",
    descricao: "Quadrantectomia Ressecção Segmentar",
    quantidade: 1,
    apresentado: 156.57,
    liberado: 156.57,
    glosa: 0.00
  },
  {
    id: "p3",
    guia: "10714706",
    data: "05/09/2024",
    carteira: "00620030013924381",
    paciente: "NUBIA KATIA PEREIRA",
    codigo: "30602289",
    descricao: "Ressecção Do Linfonodo Sentinela Torácica Lateral",
    quantidade: 1,
    apresentado: 167.68,
    liberado: 0.00,
    glosa: 167.68
  }
];

const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const demonstrativesColumns = [
  { 
    field: 'periodo', 
    headerName: 'Período', 
    width: 150 
  },
  { 
    field: 'lote', 
    headerName: 'Lote', 
    width: 120 
  },
  { 
    field: 'procedimentosTotal', 
    headerName: 'Total Procedimentos', 
    width: 170,
    renderCell: ({ value }) => (
      <span className="font-medium">{value}</span>
    )
  },
  { 
    field: 'totalApresentado', 
    headerName: 'Apresentado', 
    width: 150,
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'totalLiberado', 
    headerName: 'Liberado', 
    width: 150,
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'totalGlosa', 
    headerName: 'Glosa', 
    width: 150,
    renderCell: ({ value, row }) => (
      <span className={value > 0 ? "text-red-600 font-medium" : "text-gray-500"}>
        {formatCurrency(value)}
      </span>
    )
  },
  { 
    field: 'actions', 
    headerName: 'Ações', 
    width: 120,
    renderCell: ({ row }) => (
      <DemonstrativeDetailDialog demonstrative={row} />
    )
  }
];

const proceduresColumns = [
  { field: 'guia', headerName: 'Guia', width: 100 },
  { field: 'data', headerName: 'Data', width: 100 },
  { field: 'paciente', headerName: 'Paciente', width: 150 },
  { field: 'codigo', headerName: 'Código', width: 100 },
  { field: 'descricao', headerName: 'Descrição', flex: 1 },
  { field: 'quantidade', headerName: 'Qtd', width: 60 },
  { 
    field: 'apresentado', 
    headerName: 'Apresentado', 
    width: 120,
    valueFormatter: (params: any) => formatCurrency(params.value) 
  },
  { 
    field: 'liberado', 
    headerName: 'Liberado', 
    width: 120,
    valueFormatter: (params: any) => formatCurrency(params.value) 
  },
  { 
    field: 'glosa', 
    headerName: 'Glosa', 
    width: 120,
    renderCell: ({ value }) => (
      <span className={value > 0 ? "text-red-600 font-medium" : ""}>
        {formatCurrency(value)}
      </span>
    )
  }
];

const DemonstrativeDetailDialog = ({ demonstrative }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>Detalhes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Demonstrativo - {demonstrative.periodo}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Período</div>
                  <div className="font-medium">{demonstrative.periodo}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                  <div className="text-sm text-muted-foreground">Total Liberado</div>
                  <div className="font-medium">{formatCurrency(demonstrative.totalLiberado)}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <FileBarChart className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-sm text-muted-foreground">Procedimentos</div>
                  <div className="font-medium">{demonstrative.procedimentosTotal}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <DollarSign className="h-8 w-8 text-red-600 mb-2" />
                  <div className="text-sm text-muted-foreground">Total Glosa</div>
                  <div className="font-medium">{formatCurrency(demonstrative.totalGlosa)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalhamento de Procedimentos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="bg-blue-50">
                <CardContent className="pt-6 pb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Consultas</h4>
                      <p className="text-xs text-blue-600">{demonstrative.consultasQtd} procedimentos</p>
                    </div>
                    <p className="text-lg font-semibold text-blue-800">
                      {formatCurrency(demonstrative.consultasValor)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="pt-6 pb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Honorários</h4>
                      <p className="text-xs text-green-600">{demonstrative.honorariosQtd} procedimentos</p>
                    </div>
                    <p className="text-lg font-semibold text-green-800">
                      {formatCurrency(demonstrative.honorariosValor)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <DataGrid
                  rows={mockDetailedProcedures}
                  columns={proceduresColumns}
                  pageSize={5}
                  className="min-h-[400px]"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button>
              <ChevronRight className="h-4 w-4 mr-2" />
              Analisar Glosas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DemonstrativesPage = () => {
  const [demonstratives] = useState<any[]>(mockDemonstratives);
  const [activeTab, setActiveTab] = useState("list");
  
  const fileUpload = useFileUpload();
  const {
    files,
    isUploading,
    removeFile,
    resetFiles,
    handleFileChangeByType,
    processUploadedFiles
  } = fileUpload;

  const handleUploadDemonstrativos = async () => {
    if (files.length === 0) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }
    
    try {
      const result = await processUploadedFiles();
      if (result.success) {
        toast.success("Demonstrativos processados com sucesso");
        resetFiles();
        setActiveTab("list");
      } else {
        toast.error("Erro ao processar demonstrativos");
      }
    } catch (error) {
      toast.error("Erro ao processar os arquivos");
    }
  };

  const handleFileDrop = async (type: FileType, fileList: FileList) => {
    await handleFileChangeByType(type, fileList);
  };

  const summaryStats = {
    totalProcessado: demonstratives.reduce((sum, d) => sum + d.totalLiberado, 0),
    totalGlosa: demonstratives.reduce((sum, d) => sum + d.totalGlosa, 0),
    totalProcedimentos: demonstratives.reduce((sum, d) => sum + d.procedimentosTotal, 0)
  };

  return (
    <AuthenticatedLayout title="Demonstrativos">
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button 
              variant={activeTab === "upload" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Novo Demonstrativo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-sm text-muted-foreground">Total Liberado</div>
                <div className="font-medium text-xl">{formatCurrency(summaryStats.totalProcessado)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <DollarSign className="h-8 w-8 text-red-600 mb-2" />
                <div className="text-sm text-muted-foreground">Total Glosas</div>
                <div className="font-medium text-xl">{formatCurrency(summaryStats.totalGlosa)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <FileBarChart className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm text-muted-foreground">Procedimentos</div>
                <div className="font-medium text-xl">{summaryStats.totalProcedimentos}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Demonstrativos</TabsTrigger>
            <TabsTrigger value="upload">Novo Demonstrativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <FileBarChart className="w-5 h-5 text-primary mb-2" />
                    <h3 className="font-medium">Demonstrativos de Pagamento</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataGrid
                  rows={demonstratives}
                  columns={demonstrativesColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  className="min-h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upload de Demonstrativos</CardTitle>
                <CardDescription>
                  Faça upload de demonstrativos de pagamento para processamento e análise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileDropZone 
                  type="demonstrativo"
                  onDropFiles={handleFileDrop}
                  disabled={isUploading}
                  hasFiles={files.some(f => f.type === "demonstrativo")}
                />
                
                <FileList 
                  files={files.filter(f => f.type === "demonstrativo")} 
                  onRemove={removeFile} 
                  disabled={isUploading}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={resetFiles} 
                    disabled={files.length === 0 || isUploading}
                  >
                    Limpar
                  </Button>
                  <Button 
                    onClick={handleUploadDemonstrativos}
                    disabled={files.length === 0 || isUploading}
                  >
                    {isUploading ? 'Processando...' : 'Processar Demonstrativos'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default DemonstrativesPage;
