
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Banknote, Search, ArrowUpDown } from 'lucide-react';
import { PaymentStatementDetailed } from '@/types';
import { MedicalDataService } from '@/services/MedicalDataService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';

const DemonstrativosPage: React.FC = () => {
  const [statements, setStatements] = useState<PaymentStatementDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStatements, setFilteredStatements] = useState<PaymentStatementDetailed[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true);
      try {
        const data = await MedicalDataService.getPaymentStatements();
        setStatements(data);
        setFilteredStatements(data);
      } catch (error) {
        console.error('Error fetching statements:', error);
        toast.error('Erro ao carregar demonstrativos de pagamento');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatements();
  }, []);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStatements([...statements].sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.periodo.localeCompare(b.periodo);
        } else {
          return b.periodo.localeCompare(a.periodo);
        }
      }));
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = statements.filter(stmt => 
      stmt.periodo.toLowerCase().includes(lowercaseSearch) ||
      stmt.nome.toLowerCase().includes(lowercaseSearch) ||
      stmt.procedimentos.some(proc => 
        proc.descricaoServico.toLowerCase().includes(lowercaseSearch) ||
        proc.codigoServico.includes(searchTerm)
      )
    );
    
    setFilteredStatements(filtered);
  }, [searchTerm, statements, sortDirection]);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    
    const file = files[0];
    try {
      toast.loading('Processando demonstrativo de pagamento...');
      const { data, error } = await MedicalDataService.processPaymentStatement(file);
      
      if (error || !data) {
        throw new Error(error || 'Erro ao processar demonstrativo de pagamento');
      }
      
      const result = await MedicalDataService.savePaymentStatement(data);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar demonstrativo de pagamento');
      }
      
      toast.dismiss();
      toast.success('Demonstrativo processado com sucesso!');
      
      // Refresh the statements list
      const updatedStatements = await MedicalDataService.getPaymentStatements();
      setStatements(updatedStatements);
      setFilteredStatements(updatedStatements);
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Erro ao processar demonstrativo de pagamento');
    }
    
    // Clear the file input
    event.target.value = '';
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <MainLayout title="Demonstrativos de Pagamento">
      <PageHeader
        title="Demonstrativos de Pagamento"
        description="Gerencie seus demonstrativos de pagamento e audite os valores pagos"
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">Upload de Demonstrativos</h2>
              <p className="text-muted-foreground mb-4">
                Faça upload de PDFs dos demonstrativos de pagamento para análise e auditoria
              </p>
            </div>
            
            <div>
              <Button className="w-full md:w-auto">
                <label htmlFor="statement-upload" className="cursor-pointer flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload de Demonstrativo
                </label>
              </Button>
              <input
                id="statement-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={toggleSortDirection}>
          <ArrowUpDown className="h-4 w-4" />
          {sortDirection === 'asc' ? "Mais antigos primeiro" : "Mais recentes primeiro"}
        </Button>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar demonstrativos..."
              className="w-full md:w-[300px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredStatements.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead className="text-right">Procedimentos</TableHead>
                    <TableHead className="text-right">Glosas</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.map((stmt, index) => (
                    <TableRow key={`${stmt.periodo}-${index}`}>
                      <TableCell className="font-medium">{stmt.periodo}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={stmt.nome}>
                        {stmt.nome}
                      </TableCell>
                      <TableCell>{stmt.crm}</TableCell>
                      <TableCell className="text-right">{stmt.totais.qtdProcedimentos}</TableCell>
                      <TableCell className="text-right">
                        <span className={stmt.totais.glosas > 0 ? 'text-red-500 font-medium' : ''}>
                          {stmt.totais.glosas}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(stmt.totais.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/demonstrativos/${stmt.id}`}>
                              <Banknote className="h-4 w-4 mr-1" />
                              Detalhes
                            </Link>
                          </Button>
                          <Button variant="default" size="sm" asChild>
                            <Link to={`/auditar/${stmt.id}`}>
                              <Search className="h-4 w-4 mr-1" />
                              Auditar
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
              <Banknote className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum demonstrativo encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? "Tente outro termo de pesquisa" : "Faça upload de demonstrativos para começar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default DemonstrativosPage;
