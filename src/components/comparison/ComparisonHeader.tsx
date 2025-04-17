
import { CardDescription, CardTitle } from '@/components/ui/card';

export interface ComparisonHeaderProps {
  totalProcedimentos: number;
  hospital?: string;
  competencia?: string;
}

export const ComparisonHeader = ({
  totalProcedimentos,
  hospital,
  competencia
}: ComparisonHeaderProps) => {
  return (
    <div>
      <CardTitle className="text-xl">Análise Comparativa</CardTitle>
      <CardDescription className="mb-2">
        Comparação entre valores CBHPM 2015 e valores pagos pelo plano de saúde
      </CardDescription>
      <div className="mt-2 text-sm">
        <span className="font-medium">{totalProcedimentos} procedimentos</span>
        {hospital && <span className="mx-2">|</span>}
        {hospital && <span>{hospital}</span>}
        {competencia && <span className="mx-2">|</span>}
        {competencia && <span>Competência: {competencia}</span>}
      </div>
    </div>
  );
};
