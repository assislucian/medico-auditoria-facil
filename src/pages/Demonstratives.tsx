
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download, Filter, Upload } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileDropZone from "@/components/upload/FileDropZone";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileType } from "@/types/upload";
import FileList from "@/components/upload/FileList";
import { toast } from "sonner";

// Dados mock de exemplo para a demonstração
const mockDemonstratives = [
  { 
    id: "d1", 
    periodo: "Agosto/2024", 
    lote: "L-2024-001", 
    totalApresentado: 4500.75, 
    totalLiberado: 3980.50, 
    totalGlosa: 520.25 
  },
  { 
    id: "d2", 
    periodo: "Julho/2024", 
    lote: "L-2024-026", 
    totalApresentado: 6200.00, 
    totalLiberado: 5850.30, 
    totalGlosa: 349.70 
  },
  { 
    id: "d3", 
    periodo: "Junho/2024", 
    lote: "L-2024-015", 
    totalApresentado: 5320.50, 
    totalLiberado: 4980.00, 
    totalGlosa: 340.50 
  }
];

const demonstrativesColumns = [
  { field: 'periodo', headerName: 'Período', width: 150 },
  { field: 'lote', headerName: 'Lote', width: 120 },
  { field: 'totalApresentado', headerName: 'Total Apresentado', width: 180,
    valueFormatter: (params: any) => {
      if (params.value === undefined || params.value === null) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalLiberado', headerName: 'Total Liberado', width: 180,
    valueFormatter: (params: any) => {
      if (params.value === undefined || params.value === null) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  },
  { field: 'totalGlosa', headerName: 'Total Glosa', width: 180,
    valueFormatter: (params: any) => {
      if (params.value === undefined || params.value === null) {
        return 'R$ 0,00';
      }
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(params.value);
    }
  }
];

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

  return (
    <AuthenticatedLayout 
      title="Demonstrativos" 
      description="Visualize e gerencie seus demonstrativos de pagamento"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Demonstrativos</h2>
            <p className="text-muted-foreground">
              Acompanhe seus demonstrativos de pagamento
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("list")}
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
              Upload
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Demonstrativos</TabsTrigger>
            <TabsTrigger value="upload">Upload de Demonstrativos</TabsTrigger>
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
