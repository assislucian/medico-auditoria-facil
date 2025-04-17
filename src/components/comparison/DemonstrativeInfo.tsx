
import { DemonstrativoInfo } from '@/types/upload';

export interface DemonstrativeInfoProps {
  info: DemonstrativoInfo;
}

export const DemonstrativeInfo = ({ info }: DemonstrativeInfoProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-2">Informações do Demonstrativo</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Número:</span>
          <p className="font-medium">{info.numero}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Competência:</span>
          <p className="font-medium">{info.competencia}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Hospital:</span>
          <p className="font-medium">{info.hospital}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Data:</span>
          <p className="font-medium">{info.data}</p>
        </div>
      </div>
    </div>
  );
};
