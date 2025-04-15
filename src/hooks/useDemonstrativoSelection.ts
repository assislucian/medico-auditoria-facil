import { useState } from 'react';
import { PaymentStatement, Procedure } from '@/types/medical';

const demonstrativos: PaymentStatement[] = [
  {
    id: "dem1",
    numero: "DEM-2024-001",
    competencia: "Agosto/2024",
    hospital: "Liga Norteriog Cancer Policlinic",
    data: "2024-08-19",
    beneficiario: "00620040000604690",
    procedimentos: [
      {
        id: "proc1",
        codigo: "30602246",
        procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
        papel: "Cirurgião",
        valorCBHPM: 1521.32,
        valorPago: 457.64,
        diferenca: -1063.68,
        pago: true,
        guia: "10467538",
        beneficiario: "00620040000604690"
      },
      {
        id: "proc2",
        codigo: "30602246",
        procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
        papel: "1º Auxiliar",
        valorCBHPM: 228.82,
        valorPago: 228.82,
        diferenca: 0,
        pago: true,
        guia: "10467538",
        beneficiario: "00620040000604690"
      }
    ]
  }
];

export const useDemonstrativoSelection = () => {
  const [selectedDemonstrativo, setSelectedDemonstrativo] = useState<string>(demonstrativos[0].id);
  const currentDemonstrativo = demonstrativos.find(d => d.id === selectedDemonstrativo);
  const procedimentos = currentDemonstrativo?.procedimentos || [];

  const getTotals = () => {
    const totalCBHPM = procedimentos.reduce((acc, curr) => acc + curr.valorCBHPM, 0);
    const totalPago = procedimentos.reduce((acc, curr) => acc + curr.valorPago, 0);
    const totalDiferenca = totalCBHPM - totalPago;
    const procedimentosNaoPagos = procedimentos.filter(item => !item.pago).length;

    return {
      totalCBHPM,
      totalPago,
      totalDiferenca,
      procedimentosNaoPagos
    };
  };

  return {
    demonstrativos,
    selectedDemonstrativo,
    setSelectedDemonstrativo,
    currentDemonstrativo,
    procedimentos,
    getTotals,
  };
};
