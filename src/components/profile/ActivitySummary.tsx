
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ActivitySummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="font-medium">Documentos Analisados:</dt>
              <dd>127</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Divergências Detectadas:</dt>
              <dd>42</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Taxa de Divergência:</dt>
              <dd>33%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Valor Total Recuperado:</dt>
              <dd>R$ 12.450,75</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Operadoras mais Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              { name: "Amil", percent: 35 },
              { name: "Unimed", percent: 28 },
              { name: "Bradesco Saúde", percent: 18 },
              { name: "SulAmérica", percent: 12 },
              { name: "Outros", percent: 7 }
            ].map((item, i) => (
              <li key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Especialidades Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Ortopedia</Badge>
            <Badge>Traumatologia</Badge>
            <Badge>Artroscopia</Badge>
            <Badge>Cirurgia de Joelho</Badge>
            <Badge>Cirurgia de Mão</Badge>
            <Badge>Cirurgia da Coluna</Badge>
            <Badge>Cirurgia de Ombro</Badge>
            <Badge>Medicina Esportiva</Badge>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              Gerenciar Especialidades
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
