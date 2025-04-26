
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalGuideDetailed, ProcedimentoGuia } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';

interface MedicalGuideViewProps {
  guide: MedicalGuideDetailed;
  showPayments?: boolean;
}

export const MedicalGuideView: React.FC<MedicalGuideViewProps> = ({ 
  guide, 
  showPayments = false 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações da Guia</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Número da Guia:</dt>
                <dd>{guide.numero}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Data de Execução:</dt>
                <dd>{guide.dataExecucao}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Beneficiário:</dt>
                <dd>{guide.beneficiario.codigo} - {guide.beneficiario.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Prestador:</dt>
                <dd>{guide.prestador.codigo} - {guide.prestador.nome}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Total de Procedimentos:</dt>
                <dd>{guide.procedimentos.length}</dd>
              </div>
              {showPayments && (
                <>
                  <div className="flex justify-between">
                    <dt className="font-medium">Total Apresentado:</dt>
                    <dd>{formatCurrency(guide.procedimentos.reduce((acc, proc) => 
                      acc + (proc.valorPago || 0) * proc.quantidade, 0))}</dd>
                  </div>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead className="w-[300px]">Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participações</TableHead>
              {showPayments && (
                <TableHead className="text-right">Valor Pago</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {guide.procedimentos.map((proc, index) => (
              <TableRow key={`${proc.codigo}-${index}`}>
                <TableCell>{proc.codigo}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={proc.descricao}>
                  {proc.descricao}
                </TableCell>
                <TableCell>{proc.dataExecucao}</TableCell>
                <TableCell>{proc.quantidade}</TableCell>
                <TableCell>
                  <Badge 
                    variant={proc.status === "Fechada" ? "success" : "secondary"}
                  >
                    {proc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`participacoes-${index}`} className="border-0">
                      <AccordionTrigger className="py-1 px-0">
                        {proc.participacoes.length} médicos
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-sm">
                          {proc.participacoes.map((part, idx) => (
                            <div key={`${part.crm}-${idx}`} className="border-b pb-1 last:border-0">
                              <div className="flex justify-between">
                                <span className="font-medium">{part.funcao}</span>
                                <Badge variant={getRoleBadgeVariant(part.funcao)}>{part.funcao}</Badge>
                              </div>
                              <div>
                                {part.nome} (CRM: {part.crm})
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimeRange(part.dataInicio, part.dataFim)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
                {showPayments && (
                  <TableCell className="text-right">
                    {proc.valorPago ? formatCurrency(proc.valorPago * proc.quantidade) : "-"}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Helper function to format time range
const formatTimeRange = (start: string, end: string) => {
  try {
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    return `${startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
            ${endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    return `${start} - ${end}`;
  }
};

// Helper function to get badge variant based on role
const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'Cirurgiao':
    case 'Cirurgião':
      return 'default';
    case 'Primeiro Auxiliar':
      return 'secondary';
    case 'Segundo Auxiliar':
      return 'outline';
    case 'Anestesista':
      return 'destructive';
    default:
      return 'default';
  }
};

export default MedicalGuideView;
