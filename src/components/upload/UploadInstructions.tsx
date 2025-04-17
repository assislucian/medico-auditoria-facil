
import React from 'react';

const UploadInstructions = () => {
  return (
    <div className="text-sm text-muted-foreground mb-4">
      <p className="mb-2">
        <strong>Como funciona:</strong> Você pode enviar guias médicas, demonstrativos de pagamento, ou ambos.
      </p>
      <ul className="list-disc ml-5 space-y-1">
        <li><strong>Guias médicas:</strong> Contêm os procedimentos realizados e servem como comprovante do serviço.</li>
        <li><strong>Demonstrativos:</strong> Documentos de pagamento que detalham os valores pagos pelo plano de saúde.</li>
        <li><strong>Análise completa:</strong> Quando ambos são enviados, o sistema compara os valores pagos com a tabela CBHPM.</li>
      </ul>
    </div>
  );
};

export default UploadInstructions;
