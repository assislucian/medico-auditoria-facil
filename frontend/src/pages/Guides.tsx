import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { DataGrid } from "../components/ui/data-grid";
import { Button } from "../components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import FileDropZone from "../components/upload/FileDropZone";
import { useFileUpload } from "../hooks/useFileUpload";
import { FileType } from "../types/upload";
import FileList from "../components/upload/FileList";
import { toast } from "sonner";
import { GuideDetailDialog } from "../components/guides/GuideDetailDialog";

// Tipos para os dados extraídos da guia
interface ExtractedProcedure {
  numero_guia: string;
  data: string;
  codigo: string;
  descricao: string;
  papel: string;
  crm: string;
  qtd: number;
  status: string;
  beneficiario: string;
  [key: string]: any;
}

const guidesColumns = [
  { field: 'numero_guia', headerName: 'Nº Guia', width: 120 },
  { field: 'data', headerName: 'Data', width: 120 },
  { field: 'codigo', headerName: 'Código', width: 120 },
  { field: 'descricao', headerName: 'Descrição', flex: 1 },
  { field: 'papel', headerName: 'Papel', width: 120 },
  { field: 'qtd', headerName: 'Qtd', width: 80 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: ({ value }: { value: string }) => {
      const variant = value === "Fechada" ? "success" : 
                     value === "Pendente" ? "warning" : "default";
      return <Badge variant={variant}>{value || "-"}</Badge>;
    }
  },
  { 
    field: 'beneficiario', 
    headerName: 'Beneficiário', 
    width: 180,
    renderCell: ({ value }: { value: string }) => value || "-"
  },
];

const GuidesPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [extractedGuides, setExtractedGuides] = useState<ExtractedProcedure[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fileUpload = useFileUpload();
  const {
    files,
    isUploading,
    removeFile,
    resetFiles,
    handleFileChangeByType,
    processUploadedFiles
  } = fileUpload;

  // Upload e processamento da guia
  const handleUploadGuias = async () => {
    if (files.length === 0) {
      toast.error("Nenhum arquivo selecionado");
      return;
    }
    setLoading(true);
    try {
      // Chama o backend e espera o JSON { crm, procedures }
      const result = await processUploadedFiles();
      if (result.success && result.data && Array.isArray(result.data.procedures)) {
        setExtractedGuides(result.data.procedures);
        toast.success("Guias processadas com sucesso");
        resetFiles();
        setActiveTab("list");
      } else if (result.data && Array.isArray(result.data)) {
        // fallback: se backend retorna array direto
        setExtractedGuides(result.data);
        toast.success("Guias processadas com sucesso");
        resetFiles();
        setActiveTab("list");
      } else {
        toast.error("Erro ao processar guias");
      }
    } catch (error) {
      toast.error("Erro ao processar os arquivos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = async (type: FileType, fileList: FileList) => {
    await handleFileChangeByType(type, fileList);
  };

  // Filtro simples por código, descrição ou beneficiário
  const filteredRows = extractedGuides.filter(proc =>
    (!filter ||
      proc.codigo?.toString().includes(filter) ||
      proc.descricao?.toLowerCase().includes(filter.toLowerCase()) ||
      proc.beneficiario?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <AuthenticatedLayout title="Guias Médicas">
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Filtrar por código, descrição ou beneficiário"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              style={{ minWidth: 220 }}
              disabled={activeTab !== "list"}
            />
            <Button 
              variant={activeTab === "upload" ? "outline" : "secondary"}
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
                  rows={filteredRows}
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
                  disabled={isUploading || loading}
                  hasFiles={files.some((f: any) => f.type === "guia")}
                />
                
                <FileList 
                  files={files.filter((f: any) => f.type === "guia")} 
                  onRemove={removeFile} 
                  disabled={isUploading || loading}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={resetFiles} 
                    disabled={files.length === 0 || isUploading || loading}
                  >
                    Limpar
                  </Button>
                  <Button 
                    onClick={handleUploadGuias}
                    disabled={files.length === 0 || isUploading || loading}
                  >
                    {isUploading || loading ? 'Processando...' : 'Processar Guias'}
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
