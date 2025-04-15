
export const mockHistory = [
  {
    id: "hist-001",
    date: "15/04/2025",
    type: "Guia + Demonstrativo",
    description: "Hospital Albert Einstein - Abril 2025",
    procedimentos: 8,
    glosados: 3,
    status: "Analisado"
  },
  {
    id: "hist-002",
    date: "02/04/2025",
    type: "Demonstrativo",
    description: "Hospital Sírio-Libanês - Março 2025",
    procedimentos: 5,
    glosados: 0,
    status: "Analisado"
  },
  {
    id: "hist-003",
    date: "28/03/2025",
    type: "Guia + Demonstrativo",
    description: "Hospital Oswaldo Cruz - Março 2025",
    procedimentos: 12,
    glosados: 7,
    status: "Pendente"
  },
  {
    id: "hist-004",
    date: "15/03/2025",
    type: "Guia",
    description: "Hospital Albert Einstein - Fevereiro 2025",
    procedimentos: 3,
    glosados: 1,
    status: "Analisado"
  },
  {
    id: "hist-005",
    date: "01/03/2025",
    type: "Demonstrativo",
    description: "Hospital Sírio-Libanês - Fevereiro 2025",
    procedimentos: 6,
    glosados: 2,
    status: "Analisado"
  }
];

export type HistoryItem = typeof mockHistory[0];
