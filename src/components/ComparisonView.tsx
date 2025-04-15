import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle, Info, Download, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PaymentStatement } from '@/types/medical';
import { SummaryCards } from './comparison/SummaryCards';

const demonstrativos: PaymentStatement[] = [
  {
    id: "dem1",
    numero: "DEM-2024-001",
    competencia: "Agosto/2024",
    hospital: "Liga Norteriog Cancer Policlinic",
    data: "2024-08-19",
    beneficiario: "00620040000604690",
    procedimentos: [
      {
        id: "proc1",
        codigo: "30602246",
        procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
        papel: "Cirurgião",
        valorCBHPM: 1521.32,
        valorPago: 457.64,
        diferenca: -1063.68,
        pago: true,
        guia: "10467538",
        beneficiario: "00620040000604690"
      },
      {
        id: "proc2",
        codigo: "30602246",
        procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
        papel: "1º Auxiliar",
        valorCBHPM: 228.82,
        valorPago: 228.82,
        diferenca: 0,
        pago: true,
        guia: "10467538",
        beneficiario: "00620040000604690"
      }
    ]
  }
];

const ComparisonView = () => {
  const [selectedDemonstrativo, setSelectedDemonstrativo] = useState<string>(demonstrativos[0].id);
  const [isDetailView, setIsDetailView] = useState(false);

  const currentDemonstrativo = demonstrativos.find(d => d.id === selectedDemonstrativo);
  const procedimentos = currentDemonstrativo?.procedimentos || [];

  const totalCBHPM = procedimentos.reduce((acc, curr) => acc + curr.valorCBHPM, 0);
  const totalPago = procedimentos.reduce((acc, curr) => acc + curr.valorPago, 0);
  const totalDiferenca = totalCBHPM - totalPago;
  const procedimentosNaoPagos = procedimentos.filter(item => !item.pago).length;

  const exportReport = () => {
    if (!currentDemonstrativo) return;

    const reportData = {
      demonstrativo: {
        numero: currentDemonstrativo.numero,
        competencia: currentDemonstrativo.competencia,
        hospital: currentDemonstrativo.hospital,
        data: currentDemonstrativo.data,
        beneficiario: currentDemonstrativo.beneficiario
      },
      procedimentos: currentDemonstrativo.procedimentos.map(proc => ({
        guia: proc.guia,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel,
        valorCBHPM: proc.valorCBHPM,
        valorPago: proc.valorPago,
        diferenca: proc.diferenca,
        status: proc.pago ? (proc.diferenca < 0 ? 'Pago Parcialmente' : 'Pago Corretamente') : 'Não Pago'
      })),
      totais: {
        valorCBHPM: totalCBHPM,
        valorPago: totalPago,
        diferenca: totalDiferenca,
        procedimentosNaoPagos
      }
    };

    // Aqui você implementaria a lógica real de exportação
    console.log('Dados do relatório para contestação:', reportData);
    
    // Exemplo de nome do arquivo
    const fileName = `contestacao_${currentDemonstrativo.numero}_${currentDemonstrativo.beneficiario}.pdf`;
    toast.success(`Relatório de contestação "${fileName}" gerado com sucesso!`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Análise Comparativa</CardTitle>
            <CardDescription>
              Comparação entre valores CBHPM 2015 e valores pagos pelo plano de saúde
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Select value={selectedDemonstrativo} onValueChange={setSelectedDemonstrativo}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecione o demonstrativo" />
              </SelectTrigger>
              <SelectContent>
                {demonstrativos.map((dem) => (
                  <SelectItem key={dem.id} value={dem.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{dem.numero} - {dem.hospital}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant={isDetailView ? "outline" : "default"} 
              size="sm" 
              onClick={() => setIsDetailView(false)}
            >
              Resumo
            </Button>
            <Button 
              variant={isDetailView ? "default" : "outline"} 
              size="sm" 
              onClick={() => setIsDetailView(true)}
            >
              Detalhes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentDemonstrativo && (
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Informações do Demonstrativo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Número:</span>
                <p className="font-medium">{currentDemonstrativo.numero}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Competência:</span>
                <p className="font-medium">{currentDemonstrativo.competencia}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hospital:</span>
                <p className="font-medium">{currentDemonstrativo.hospital}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data:</span>
                <p className="font-medium">{new Date(currentDemonstrativo.data).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <SummaryCards 
          totalCBHPM={totalCBHPM}
          totalPago={totalPago}
          totalDiferenca={totalDiferenca}
          procedimentosNaoPagos={procedimentosNaoPagos}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Guia</TableHead>
              <TableHead className="w-[300px]">Procedimento</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="text-right">Valor CBHPM</TableHead>
              <TableHead className="text-right">Valor Pago</TableHead>
              <TableHead className="text-right">Diferença</TableHead>
              <TableHead className="text-center">Status</TableHead>
              {isDetailView && <TableHead>Ação</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedimentos.map((item) => (
              <TableRow key={item.id} className={!item.pago ? 'bg-red-500/5' : item.diferenca < 0 ? 'bg-amber-500/5' : ''}>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.guia}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {item.procedimento}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Informações detalhadas sobre o procedimento {item.codigo}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.papel === "Cirurgião" ? "bg-blue-500/10 text-blue-500" : 
                    item.papel === "1º Auxiliar" ? "bg-green-500/10 text-green-500" : 
                    "bg-amber-500/10 text-amber-500"
                  }>
                    {item.papel}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">R$ {item.valorCBHPM.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {item.pago ? `R$ ${item.valorPago.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.diferenca === 0 ? (
                    <span>-</span>
                  ) : (
                    <span className={item.diferenca < 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                      {item.diferenca < 0 ? '-' : '+'} R$ {Math.abs(item.diferenca).toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {item.pago ? (
                    item.diferenca < 0 ? (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        Pago Parcialmente
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pago Corretamente
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Não Pago
                    </Badge>
                  )}
                </TableCell>
                {isDetailView && (
                  <TableCell>
                    <Button variant="ghost" size="sm">Contestar</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex justify-between w-full items-center">
          <p className="text-sm text-muted-foreground">
            Análise baseada na Tabela CBHPM 2015
          </p>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório para Contestação
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComparisonView;
