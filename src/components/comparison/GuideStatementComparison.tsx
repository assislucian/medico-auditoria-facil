
import React from 'react';
import { ComparisonResult } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Coins, FileText, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface GuideStatementComparisonProps {
  comparison: ComparisonResult;
}

export const GuideStatementComparison: React.FC<GuideStatementComparisonProps> = ({ comparison }) => {
  const { guia, demonstrativo, discrepancias } = comparison;
  
  const totalProcs = guia.procedimentos.length;
  const procsWithIssues = discrepancias.length;
  const isAllGood = procsWithIssues === 0;
  
  return (
    <div className="space-y-6">
      {isAllGood ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-800">Tudo certo!</AlertTitle>
          <AlertDescription className="text-green-700">
            Todos os procedimentos da guia foram encontrados nos demonstrativos de pagamento e não há discrepâncias.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Atenção: Discrepâncias encontradas</AlertTitle>
          <AlertDescription>
            Foram encontradas {procsWithIssues} discrepâncias de pagamento entre a guia e os demonstrativos.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações da Guia</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Número:</dt>
                <dd>{guia.numero}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Data:</dt>
                <dd>{guia.dataExecucao}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Beneficiário:</dt>
                <dd className="truncate max-w-[180px]" title={guia.beneficiario.nome}>
                  {guia.beneficiario.nome}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Prestador:</dt>
                <dd className="truncate max-w-[180px]" title={guia.prestador.nome}>
                  {guia.prestador.nome}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Total de procedimentos:</dt>
                <dd>{totalProcs}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Procedimentos com problemas:</dt>
                <dd className={procsWithIssues > 0 ? "text-red-600 font-medium" : ""}>{procsWithIssues}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Procedimentos corretos:</dt>
                <dd className="text-green-600 font-medium">{totalProcs - procsWithIssues}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tipos de Discrepâncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Não pagos</Badge>
                </div>
                <div className="font-medium">
                  {discrepancias.filter(d => d.tipo === 'nao_pago').length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pagos parcialmente</Badge>
                </div>
                <div className="font-medium">
                  {discrepancias.filter(d => d.tipo === 'pago_parcialmente').length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Função incorreta</Badge>
                </div>
                <div className="font-medium">
                  {discrepancias.filter(d => d.tipo === 'funcao_incorreta').length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Outros problemas</Badge>
                </div>
                <div className="font-medium">
                  {discrepancias.filter(d => d.tipo === 'outro').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {discrepancias.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead className="w-[250px]">Procedimento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Guia</TableHead>
                <TableHead>Demonstrativo</TableHead>
                <TableHead className="w-[250px]">Descrição</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discrepancias.map((disc, index) => {
                const procGuia = disc.procedimentoGuia;
                const procDem = disc.procedimentoDemonstrativo;
                
                return (
                  <TableRow key={`${procGuia.codigo}-${index}`}>
                    <TableCell className="font-medium">{procGuia.codigo}</TableCell>
                    <TableCell className="max-w-[250px] truncate" title={procGuia.descricao}>
                      {procGuia.descricao}
                    </TableCell>
                    <TableCell>
                      <DiscrepancyBadge tipo={disc.tipo} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Quantidade: {procGuia.quantidade}
                        </div>
                        <div className="text-xs">
                          {procGuia.participacoes[0]?.funcao || 'Função não especificada'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {procDem ? (
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Apresentado: {formatCurrency(procDem.valorApresentado)}
                          </div>
                          <div className="text-xs">
                            Liberado: {formatCurrency(procDem.valorLiberado)}
                          </div>
                          {procDem.glosa > 0 && (
                            <div className="text-xs text-red-500 font-medium">
                              Glosa: {formatCurrency(procDem.glosa)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-500 text-sm font-medium">Não encontrado</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[250px] text-sm" title={disc.descricao}>
                      {disc.descricao}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                          onClick={() => alert('Esta funcionalidade será implementada em breve!')}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Contestar
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

// Helper component for discrepancy badges
const DiscrepancyBadge: React.FC<{ tipo: string }> = ({ tipo }) => {
  switch (tipo) {
    case 'nao_pago':
      return <Badge variant="destructive">Não pago</Badge>;
    case 'pago_parcialmente':
      return <Badge variant="secondary">Pago parcialmente</Badge>;
    case 'funcao_incorreta':
      return <Badge variant="outline">Função incorreta</Badge>;
    default:
      return <Badge variant="default">Outro problema</Badge>;
  }
};

export default GuideStatementComparison;
