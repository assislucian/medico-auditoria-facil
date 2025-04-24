
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileCheck, FileText, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { type HistoryItem } from "./data";
import { useNavigate } from "react-router-dom";

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items }: HistoryTableProps) {
  const navigate = useNavigate();
  
  const handleViewDetails = (id: string) => {
    navigate(`/compare?analysisId=${id}`);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Procedimentos</TableHead>
                <TableHead className="text-center">Glosados</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>
                      {item.type === "Guia" ? (
                        <Badge variant="outline" className="bg-medblue-600/10 text-medblue-600 border-medblue-200">
                          <FileText className="mr-1 h-3 w-3" />
                          Guia
                        </Badge>
                      ) : item.type === "Demonstrativo" ? (
                        <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-200">
                          <FileCheck className="mr-1 h-3 w-3" />
                          Demonstrativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-purple-600/10 text-purple-600 border-purple-200">
                          <FileText className="mr-1 h-3 w-3" />
                          Ambos
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.procedimentos}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${item.glosados > 0 ? "text-red-500" : "text-green-500"}`}>
                        {item.glosados}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(item.id)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Baixar relatório"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center">
                      <X className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Nenhum registro encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

