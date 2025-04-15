
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FileCheck, 
  Download, 
  Eye, 
  Calendar, 
  Search,
  Check,
  X,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for demonstration
const mockHistory = [
  {
    id: "hist-001",
    date: "15/04/2025",
    type: "Guia + Demonstrativo",
    description: "Hospital Albert Einstein - Abril 2025",
    procedimentos: 8,
    glosados: 3,
    status: "Analisado"
  },
  {
    id: "hist-002",
    date: "02/04/2025",
    type: "Demonstrativo",
    description: "Hospital Sírio-Libanês - Março 2025",
    procedimentos: 5,
    glosados: 0,
    status: "Analisado"
  },
  {
    id: "hist-003",
    date: "28/03/2025",
    type: "Guia + Demonstrativo",
    description: "Hospital Oswaldo Cruz - Março 2025",
    procedimentos: 12,
    glosados: 7,
    status: "Pendente"
  },
  {
    id: "hist-004",
    date: "15/03/2025",
    type: "Guia",
    description: "Hospital Albert Einstein - Fevereiro 2025",
    procedimentos: 3,
    glosados: 1,
    status: "Analisado"
  },
  {
    id: "hist-005",
    date: "01/03/2025",
    type: "Demonstrativo",
    description: "Hospital Sírio-Libanês - Fevereiro 2025",
    procedimentos: 6,
    glosados: 2,
    status: "Analisado"
  }
];

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  
  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || item.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Histórico de Análises | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Histórico de Análises</h1>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por hospital ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="analisado">Analisado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
          
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
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
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
                            {item.status === "Analisado" ? (
                              <Badge className="bg-green-600/10 text-green-600 border-green-200">
                                <Check className="mr-1 h-3 w-3" />
                                Analisado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-600/10 text-amber-600 border-amber-200">
                                <Clock className="mr-1 h-3 w-3" />
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
