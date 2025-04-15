
import { PaymentStatement } from '@/types/medical';

interface DemonstrativeInfoProps {
  demonstrativo: PaymentStatement;
}

export const DemonstrativeInfo = ({ demonstrativo }: DemonstrativeInfoProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-2">Informações do Demonstrativo</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Número:</span>
          <p className="font-medium">{demonstrativo.numero}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Competência:</span>
          <p className="font-medium">{demonstrativo.competencia}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Hospital:</span>
          <p className="font-medium">{demonstrativo.hospital}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Data:</span>
          <p className="font-medium">{new Date(demonstrativo.data).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
