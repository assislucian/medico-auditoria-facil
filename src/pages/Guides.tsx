import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { FileText, Filter, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileDropZone from "@/components/upload/FileDropZone";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileType } from "@/types/upload";
import FileList from "@/components/upload/FileList";
import { toast } from "sonner";
import { GuideDetailDialog } from "@/components/guides/GuideDetailDialog";

const mockGuides = [
  {
    id: "g1",
    numero: "10714706",
    execucao: "193026",
    dataExecucao: "05/09/2024",
    beneficiario: "NUBIA KATIA PEREIRA MARQUES",
    prestador: "LIGA NORTERIOG CANCER POLICLINIC",
    qtdProcedimentos: 4,
    status: "Fechada",
    procedimentos: [
      {
        code: "30602076",
        description: "Exérese De Lesão Da Mama Por Marcação Estereotáxica",
        quantity: 1,
        status: "Fechada",
        doctors: [
          {
            role: "Anestesista",
            crm: "7897",
            name: "DIEGO HERBERT DUARTE DA SILVA",
            startTime: "05/09/2024 18:38",
            endTime: "05/09/2024 22:15",
            status: "Fechada"
          },
          {
            role: "Cirurgião",
            crm: "7546",
            name: "ANA BEATRIZ OLIVEIRA GERMANO",
            startTime: "05/09/2024 18:10",
            endTime: "05/09/2024 22:15",
            status: "Fechada"
          },
          {
            role: "Primeiro Auxiliar",
            crm: "6091",
            name: "MOISES DE OLIVEIRA SCHOTS",
            startTime: "05/09/2024 18:11",
            endTime: "05/09/2024 22:25",
            status: "Fechada"
          }
        ]
      }
    ]
  }
];

const guidesColumns = [
  { field: 'numero', headerName: 'Nº Guia', width: 120 },
  { field: 'execucao', headerName: 'Execução', width: 100 },
  { field: 'dataExecucao', headerName: 'Data', width: 120 },
  { field: 'beneficiario', headerName: 'Beneficiário', flex: 1 },
  { field: 'qtdProcedimentos', headerName: 'Procedimentos', width: 120 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: ({ value }) => {
      const variant = value === "Fechada" ? "success" : 
                     value === "Pendente" ? "warning" : "default";
      
      return <Badge variant={variant}>{value}</Badge>;
    }
  },
  { 
    field: 'actions', 
    headerName: 'Ações', 
    width: 100,
    renderCell: ({ row }) => (
      <GuideDetailDialog guide={row} />
    )
  }
];

const GuidesPage = () => {
  const [guides] = useState<any[]>(mockGuides);
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

  const handleUploadGuias = async () => {
    if (files.length === 0) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }
    
    try {
      const result = await processUploadedFiles();
      if (result.success) {
        toast.success("Guias processadas com sucesso");
        resetFiles();
        setActiveTab("list");
      } else {
        toast.error("Erro ao processar guias");
      }
    } catch (error) {
      toast.error("Erro ao processar os arquivos");
    }
  };

  const handleFileDrop = async (type: FileType, fileList: FileList) => {
    await handleFileChangeByType(type, fileList);
  };

  return (
    <AuthenticatedLayout title="Guias Médicas">
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
              Nova Guia
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Guias</TabsTrigger>
            <TabsTrigger value="upload">Upload de Guias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <FileText className="w-5 h-5 text-primary mb-2" />
                    <h3 className="font-medium">Guias Médicas</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataGrid
                  rows={guides}
                  columns={guidesColumns}
                  pageSize={10}
                  className="min-h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upload de Guias</CardTitle>
                <CardDescription>
                  Faça upload de guias TISS para processamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileDropZone 
                  type="guia"
                  onDropFiles={handleFileDrop}
                  disabled={isUploading}
                  hasFiles={files.some(f => f.type === "guia")}
                />
                
                <FileList 
                  files={files.filter(f => f.type === "guia")} 
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
                    onClick={handleUploadGuias}
                    disabled={files.length === 0 || isUploading}
                  >
                    {isUploading ? 'Processando...' : 'Processar Guias'}
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

export default GuidesPage;
