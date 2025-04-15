
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
    valorBase: 1521.32,
    porteAnestesico: 456.40,
    custoOperacional: 380.33
  },
  // ... more procedures would be added here
];

export const findProcedureByCodigo = (codigo: string): CBHPMProcedure | undefined => {
  return cbhpmTable.find(proc => proc.codigo === codigo);
};

export const calculateTotalCBHPM = (procedure: CBHPMProcedure): number => {
  return procedure.valorBase + (procedure.porteAnestesico || 0) + (procedure.custoOperacional || 0);
};

