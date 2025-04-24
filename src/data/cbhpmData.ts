
/**
 * cbhpmData.ts
 * 
 * Dados de referência da tabela CBHPM 2015.
 * Fornece informações sobre códigos, descrições e valores de procedimentos médicos.
 */

// Define a estrutura dos dados CBHPM
export interface CBHPMProcedure {
  codigo: string;
  descricao: string;
  porte_cirurgiao: string;
  porte_anestesista?: string;
  cust_oper: string;
  n_aux: string;
  valor_cirurgiao?: string;
  valor_anestesista?: string;
}

/**
 * Busca um procedimento pelo código CBHPM
 * @param codigo Código do procedimento
 * @returns Dados do procedimento ou null se não encontrado
 */
export function findProcedureByCodigo(codigo: string): CBHPMProcedure | null {
  // Verificar no banco de dados em memória
  const procedure = cbhpmData.find(p => p.codigo === codigo);
  return procedure || null;
}

/**
 * Calcula o valor total CBHPM de um procedimento
 * @param procedure Dados do procedimento
 * @returns Valor total
 */
export function calculateTotalCBHPM(procedure: CBHPMProcedure): number {
  const valorCirurgiao = parseFloat(procedure.valor_cirurgiao || '0');
  const valorAnestesista = parseFloat(procedure.valor_anestesista || '0');
  
  // O total é a soma do valor do cirurgião e do anestesista, se houver
  return valorCirurgiao + valorAnestesista;
}

/**
 * Banco de dados simplificado de procedimentos CBHPM 2015
 */
const cbhpmData: CBHPMProcedure[] = [
  {
    codigo: "30602246",
    descricao: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
    porte_cirurgiao: "9A",
    porte_anestesista: "5",
    cust_oper: "2.640,00",
    n_aux: "2",
    valor_cirurgiao: "3772.88",
    valor_anestesista: "1132.74"
  },
  {
    codigo: "30602076",
    descricao: "Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll",
    porte_cirurgiao: "8A",
    porte_anestesista: "4",
    cust_oper: "1.206,00",
    n_aux: "1",
    valor_cirurgiao: "2450.65",
    valor_anestesista: "906.19"
  },
  {
    codigo: "31309186",
    descricao: "Catarata - Facoemulsificação Com Implante De Lente Intraocular Dobrável",
    porte_cirurgiao: "8B",
    porte_anestesista: "4",
    cust_oper: "565,30",
    n_aux: "1",
    valor_cirurgiao: "1768.43",
    valor_anestesista: "906.19"
  },
  {
    codigo: "31003079",
    descricao: "Tratamento Cirúrgico Do Glaucoma Congênito",
    porte_cirurgiao: "9C",
    porte_anestesista: "4",
    cust_oper: "699,20",
    n_aux: "1",
    valor_cirurgiao: "2145.30",
    valor_anestesista: "906.19"
  },
  {
    codigo: "30715016",
    descricao: "Correção Cirúrgica De Sindactilia Dois Dígitos",
    porte_cirurgiao: "7C",
    porte_anestesista: "3",
    cust_oper: "1.055,00",
    n_aux: "1",
    valor_cirurgiao: "1950.56",
    valor_anestesista: "679.64"
  }
];

/**
 * Exporta o banco de dados CBHPM para uso externo
 */
export { cbhpmData };
