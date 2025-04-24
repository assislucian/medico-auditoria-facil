
import { toast } from 'sonner';

/**
 * Exporta dados para XML no formato TISS da ANS
 * @param data Os dados a serem exportados
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToTissXML<T extends Record<string, any>>(data: T[], filename: string): void {
  try {
    // Importação dinâmica da biblioteca xml-js
    import('xmlbuilder2').then((xmlbuilder) => {
      const { create } = xmlbuilder;
      
      // Criar estrutura base do XML TISS
      const root = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('ans:mensagemTISS', {
          'xmlns:ans': 'http://www.ans.gov.br/padroes/tiss/schemas',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation': 'http://www.ans.gov.br/padroes/tiss/schemas',
          'versaoCompTISS': '3.05.00'
        });

      // Adicionar cabeçalho
      const cabecalho = root.ele('ans:cabecalho');
      cabecalho.ele('ans:identificacaoTransacao')
        .ele('ans:tipoTransacao').txt('ENVIO_LOTE_GUIAS').up()
        .ele('ans:sequencialTransacao').txt('1').up()
        .ele('ans:dataRegistroTransacao').txt(new Date().toISOString().split('T')[0]).up()
        .ele('ans:horaRegistroTransacao').txt(new Date().toISOString().split('T')[1].substring(0, 8));

      // Adicionar dados
      const corpo = root.ele('ans:corpo');
      const lote = corpo.ele('ans:loteGuias');

      // Itens do lote
      data.forEach((item, index) => {
        const guia = lote.ele('ans:guiaSP-SADT');
        
        // Mapeamento básico para formato TISS
        guia.ele('ans:identificacaoGuiaSADTSP')
          .ele('ans:numeroGuiaPrestador').txt(item.id || `GUIA${index}`);

        // Adicionar procedimentos se existirem
        if (item.procedimentos) {
          const procedimentosRealizados = guia.ele('ans:procedimentosRealizados');
          
          // Transformar dados de procedimentos no formato TISS
          if (Array.isArray(item.procedimentos)) {
            item.procedimentos.forEach((proc: any, procIndex: number) => {
              const procedimento = procedimentosRealizados.ele('ans:procedimentoRealizado');
              procedimento.ele('ans:procedimento')
                .ele('ans:codigoTabela').txt('22').up()
                .ele('ans:codigoProcedimento').txt(proc.codigo || '').up()
                .ele('ans:descricaoProcedimento').txt(proc.descricao || proc.procedimento || '');
            });
          }
        }
      });

      // Gerar XML como string
      const xmlString = root.end({ prettyPrint: true });
      
      // Criar blob e iniciar download
      const blob = new Blob([xmlString], { type: 'application/xml' });
      saveAs(blob, `${filename}.xml`);
      
      toast.success('XML exportado com sucesso', {
        description: `O arquivo ${filename}.xml foi baixado com sucesso.`
      });
    }).catch(error => {
      console.error('Erro ao carregar biblioteca XML:', error);
      toast.error('Falha ao exportar XML');
    });
  } catch (error) {
    console.error('Erro ao exportar dados para XML:', error);
    toast.error('Falha ao exportar XML');
  }
}

// Utility function for file saving (since it's used here and in other export services)
function saveAs(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
