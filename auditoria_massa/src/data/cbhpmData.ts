
interface CBHPMProcedure {
  codigo: string;
  descricao: string;
  valorBase: number;
  porteAnestesico?: number;
  custoOperacional?: number;
}

// Sample of the CBHPM 2015 data structure
// In production, this would be a complete dataset from the spreadsheet
export const cbhpmTable: CBHPMProcedure[] = [
  {
    codigo: "30602246",
    descricao: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    valorBase: 2771.40,
    porteAnestesico: 456.40,
    custoOperacional: 545.08
  },
  {
    codigo: "30602076",
    descricao: "Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll",
    valorBase: 1895.25,
    porteAnestesico: 230.40,
    custoOperacional: 325.00
  },
  {
    codigo: "30602203",
    descricao: "Quadrantectomia - Ressecção Segmentar",
    valorBase: 1650.20,
    porteAnestesico: 285.10,
    custoOperacional: 250.00
  },
  // ... more procedures would be added here
];

export const findProcedureByCodigo = (codigo: string): CBHPMProcedure | undefined => {
  return cbhpmTable.find(proc => proc.codigo === codigo);
};

export const calculateTotalCBHPM = (procedure: CBHPMProcedure): number => {
  return procedure.valorBase + (procedure.porteAnestesico || 0) + (procedure.custoOperacional || 0);
};
