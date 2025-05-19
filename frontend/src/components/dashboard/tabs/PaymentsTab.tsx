import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PaymentsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Procedimentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">31170123 - Facectomia com LIO</div>
                <Badge variant="success">Pago</Badge>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>R$ 983,45</span>
                <span>21/04/2025</span>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">30912040 - Vitrectomia posterior</div>
                <Badge variant="destructive">Glosado</Badge>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>R$ 0,00</span>
                <span>19/04/2025</span>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">30809053 - Palpebra - reconstrução total</div>
                <Badge variant="success">Pago</Badge>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>R$ 1.245,00</span>
                <span>15/04/2025</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild className="w-full flex items-center gap-1">
              <Link to="/guides">
                Ver todas as guias
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Valor pago vs. CBHPM 2015</p>
                <p className="text-xs text-muted-foreground">Média dos últimos 30 dias</p>
              </div>
              <div className="text-2xl font-bold text-success">92%</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cirurgião</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                <div className="bg-success h-2 w-[95%]"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1º Auxiliar</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                <div className="bg-success h-2 w-[87%]"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>2º Auxiliar</span>
                <span className="font-medium text-warning">78%</span>
              </div>
              <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                <div className="bg-warning h-2 w-[78%]"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Anestesista</span>
                <span className="font-medium text-destructive">68%</span>
              </div>
              <div className="rounded-full bg-muted h-2 w-full overflow-hidden">
                <div className="bg-destructive h-2 w-[68%]"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild className="w-full flex items-center gap-1">
              <Link to="/compare">
                Ver comparativo detalhado
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;

