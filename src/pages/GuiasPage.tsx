
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Search } from 'lucide-react';
import { MedicalGuideDetailed } from '@/types';
import { MedicalDataService } from '@/services/MedicalDataService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GuiasPage: React.FC = () => {
  const [guides, setGuides] = useState<MedicalGuideDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGuides, setFilteredGuides] = useState<MedicalGuideDetailed[]>([]);
  
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const data = await MedicalDataService.getMedicalGuides();
        setGuides(data);
        setFilteredGuides(data);
      } catch (error) {
        console.error('Error fetching guides:', error);
        toast.error('Erro ao carregar guias médicas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, []);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredGuides(guides);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = guides.filter(guide => 
      guide.numero.toLowerCase().includes(lowercaseSearch) ||
      guide.beneficiario.nome.toLowerCase().includes(lowercaseSearch) ||
      guide.procedimentos.some(proc => 
        proc.descricao.toLowerCase().includes(lowercaseSearch) ||
        proc.codigo.includes(searchTerm)
      )
    );
    
    setFilteredGuides(filtered);
  }, [searchTerm, guides]);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    
    const file = files[0];
    try {
      toast.loading('Processando guia médica...');
      const { data, error } = await MedicalDataService.processMedicalGuide(file);
      
      if (error || !data) {
        throw new Error(error || 'Erro ao processar guia médica');
      }
      
      const result = await MedicalDataService.saveMedicalGuide(data);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar guia médica');
      }
      
      toast.dismiss();
      toast.success('Guia médica processada com sucesso!');
      
      // Refresh the guides list
      const updatedGuides = await MedicalDataService.getMedicalGuides();
      setGuides(updatedGuides);
      setFilteredGuides(updatedGuides);
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Erro ao processar guia médica');
    }
    
    // Clear the file input
    event.target.value = '';
  };
  
  return (
    <MainLayout title="Guias Médicas">
      <PageHeader
        title="Guias Médicas"
        description="Gerencie suas guias médicas e compare com os demonstrativos de pagamento"
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">Upload de Guias Médicas</h2>
              <p className="text-muted-foreground mb-4">
                Faça upload de PDFs das guias TISS para análise e comparação com os demonstrativos
              </p>
            </div>
            
            <div>
              <Button className="w-full md:w-auto">
                <label htmlFor="guide-upload" className="cursor-pointer flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload de Guia
                </label>
              </Button>
              <input
                id="guide-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="todas">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="todas">Todas as guias</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="processadas">Processadas</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar guias..."
                className="w-full md:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <TabsContent value="todas" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredGuides.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Beneficiário</TableHead>
                        <TableHead>Prestador</TableHead>
                        <TableHead>Procedimentos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuides.map((guide, index) => (
                        <TableRow key={`${guide.numero}-${index}`}>
                          <TableCell className="font-medium">{guide.numero}</TableCell>
                          <TableCell>{guide.dataExecucao}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={guide.beneficiario.nome}>
                            {guide.beneficiario.nome}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={guide.prestador.nome}>
                            {guide.prestador.nome}
                          </TableCell>
                          <TableCell>{guide.procedimentos.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/guias/${guide.numero}`}>
                                  <FileText className="h-4 w-4 mr-1" />
                                  Detalhes
                                </Link>
                              </Button>
                              <Button variant="default" size="sm" asChild>
                                <Link to={`/comparar/${guide.numero}`}>
                                  <Search className="h-4 w-4 mr-1" />
                                  Comparar
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma guia encontrada</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ? "Tente outro termo de pesquisa" : "Faça upload de guias médicas para começar"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default GuiasPage;
