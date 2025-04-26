
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { PaymentStatementDetailed, ProcedimentoDemonstrativo } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentStatementViewProps {
  statement: PaymentStatementDetailed;
}

export const PaymentStatementView: React.FC<PaymentStatementViewProps> = ({ statement }) => {
  const [activeTab, setActiveTab] = useState<string>('todos');
  
  const procedimentosConsulta = statement.procedimentos.filter(p => p.tipo === 'consulta');
  const procedimentosHonorarios = statement.procedimentos.filter(p => p.tipo === 'honorario');
  const procedimentosOutros = statement.procedimentos.filter(p => p.tipo !== 'consulta' && p.tipo !== 'honorario');
  
  const filteredProcedimentos = activeTab === 'todos' 
    ? statement.procedimentos 
    : activeTab === 'consultas' 
      ? procedimentosConsulta
      : activeTab === 'honorarios'
        ? procedimentosHonorarios
        : procedimentosOutros;
  
  const procedimentosComGlosa = statement.procedimentos.filter(p => p.glosa > 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações do Demonstrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Período:</dt>
                <dd>{statement.periodo}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Nome:</dt>
                <dd>{statement.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">CRM:</dt>
                <dd>{statement.crm}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">CPF:</dt>
                <dd>{statement.cpf}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Consultas:</dt>
                <dd>{formatCurrency(statement.totais.consultas)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Honorários:</dt>
                <dd>{formatCurrency(statement.totais.honorarios)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2">
                <dt className="font-medium">Total:</dt>
                <dd className="font-bold">{formatCurrency(statement.totais.total)}</dd>
              </div>
              <div className="flex justify-between text-red-500">
                <dt className="font-medium">Glosas:</dt>
                <dd>{statement.totais.glosas} ({formatCurrency(statement.totais.valorGlosas)})</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todos" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="todos">
              Todos ({statement.procedimentos.length})
            </TabsTrigger>
            <TabsTrigger value="consultas">
              Consultas ({procedimentosConsulta.length})
            </TabsTrigger>
            <TabsTrigger value="honorarios">
              Honorários ({procedimentosHonorarios.length})
            </TabsTrigger>
            <TabsTrigger value="outros">
              Outros ({procedimentosOutros.length})
            </TabsTrigger>
          </TabsList>
          
          {procedimentosComGlosa.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {procedimentosComGlosa.length} com glosa
            </Badge>
          )}
        </div>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guia</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="w-[250px]">Descrição</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Apresentado</TableHead>
                  <TableHead className="text-right">Liberado</TableHead>
                  <TableHead className="text-right">Glosa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedimentos.map((proc, index) => (
                  <TableRow 
                    key={`${proc.guia}-${proc.codigoServico}-${index}`} 
                    className={proc.glosa > 0 ? "bg-red-50" : undefined}
                  >
                    <TableCell>{proc.guia}</TableCell>
                    <TableCell>{proc.data}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={proc.nome}>
                      {proc.nome}
                    </TableCell>
                    <TableCell>{proc.codigoServico}</TableCell>
                    <TableCell className="max-w-[250px] truncate" title={proc.descricaoServico}>
                      {proc.descricaoServico}
                    </TableCell>
                    <TableCell className="text-right">{proc.quantidade}</TableCell>
                    <TableCell className="text-right">{formatCurrency(proc.valorApresentado)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(proc.valorLiberado)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {proc.glosa > 0 ? (
                        <span className="text-red-600">{formatCurrency(proc.glosa)}</span>
                      ) : (
                        "0,00"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {statement.glosas && statement.glosas.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="glosas">
            <AccordionTrigger className="text-red-600 font-medium">
              Detalhamento de Glosas ({statement.glosas.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guia</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Beneficiário</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="w-[300px]">Descrição</TableHead>
                      <TableHead>Código Glosa</TableHead>
                      <TableHead className="w-[250px]">Motivo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statement.glosas.map((glosa, index) => (
                      <TableRow key={`${glosa.guia}-${glosa.codigoServico}-${index}`}>
                        <TableCell>{glosa.guia}</TableCell>
                        <TableCell>{glosa.data}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={glosa.nome}>
                          {glosa.nome}
                        </TableCell>
                        <TableCell>{glosa.codigoServico}</TableCell>
                        <TableCell className="max-w-[300px] truncate" title={glosa.descricaoServico}>
                          {glosa.descricaoServico}
                        </TableCell>
                        <TableCell>{glosa.codigo}</TableCell>
                        <TableCell className="max-w-[250px] truncate" title={glosa.descricao}>
                          {glosa.descricao}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatCurrency(glosa.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default PaymentStatementView;
