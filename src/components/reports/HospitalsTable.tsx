
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hospitalData } from "./data";

export function HospitalsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise por Hospital</CardTitle>
        <CardDescription>Procedimentos e glosas por instituição</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Hospital</th>
                <th className="pb-2 text-center font-medium">Procedimentos</th>
                <th className="pb-2 text-center font-medium">Glosados</th>
                <th className="pb-2 text-center font-medium">% Glosa</th>
                <th className="pb-2 text-center font-medium">Recuperados</th>
                <th className="pb-2 text-center font-medium">% Recuperação</th>
              </tr>
            </thead>
            <tbody>
              {hospitalData.map((hospital, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{hospital.name}</td>
                  <td className="py-3 text-center">{hospital.procedimentos}</td>
                  <td className="py-3 text-center text-red-500 font-medium">{hospital.glosados}</td>
                  <td className="py-3 text-center">
                    {((hospital.glosados / hospital.procedimentos) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-center text-green-500 font-medium">{hospital.recuperados}</td>
                  <td className="py-3 text-center">
                    {((hospital.recuperados / hospital.glosados) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
