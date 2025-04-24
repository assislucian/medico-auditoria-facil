
/**
 * ComparisonLoading.tsx
 * 
 * Componente para exibição do estado de carregamento durante a análise.
 * Mostra um skeleton UI enquanto os dados estão sendo processados.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Componente de carregamento da visualização comparativa
 */
export function ComparisonLoading() {
  return (
    <Card className="mb-6">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        {/* Esqueleto do resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        
        {/* Esqueleto das tabs */}
        <div className="mt-8">
          <Skeleton className="h-10 w-full mb-6" />
          
          {/* Esqueleto da tabela */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
