
import { PaymentStatement } from '@/types/medical';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonHeaderProps {
  demonstrativos: PaymentStatement[];
  selectedDemonstrativo: string;
  onDemonstrativoChange: (value: string) => void;
  onViewChange: (isDetail: boolean) => void;
  isDetailView: boolean;
}

export const ComparisonHeader = ({
  demonstrativos,
  selectedDemonstrativo,
  onDemonstrativoChange,
  onViewChange,
  isDetailView
}: ComparisonHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl">Análise Comparativa</CardTitle>
          <CardDescription>
            Comparação entre valores CBHPM 2015 e valores pagos pelo plano de saúde
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Select value={selectedDemonstrativo} onValueChange={onDemonstrativoChange}>
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
            onClick={() => onViewChange(false)}
          >
            Resumo
          </Button>
          <Button 
            variant={isDetailView ? "default" : "outline"} 
            size="sm" 
            onClick={() => onViewChange(true)}
          >
            Detalhes
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
