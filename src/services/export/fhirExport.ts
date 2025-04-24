
import { toast } from 'sonner';

/**
 * Exporta dados para JSON no formato HL7 FHIR
 * @param data Os dados a serem exportados
 * @param resourceType Tipo de recurso FHIR (Patient, Practitioner, etc)
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToFHIR<T extends Record<string, any>>(
  data: T[], 
  resourceType: string,
  filename: string
): void {
  try {
    // Criar estrutura base do bundle FHIR
    const fhirBundle = {
      resourceType: "Bundle",
      type: "collection",
      meta: {
        lastUpdated: new Date().toISOString()
      },
      entry: data.map(item => {
        const resource = {
          resourceType: resourceType,
          id: item.id || crypto.randomUUID(),
          meta: {
            versionId: "1",
            lastUpdated: new Date().toISOString()
          }
        };

        // Adicionar propriedades específicas por tipo de recurso
        switch (resourceType) {
          case 'Patient':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                name: [{
                  use: "official",
                  text: item.nome || item.name || "Nome não especificado"
                }],
                gender: item.genero || item.gender || "unknown",
                birthDate: item.dataNascimento || item.birthDate
              }
            };
          case 'Practitioner':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                identifier: [{
                  system: "http://conselho.saude.gov.br/crm",
                  value: item.crm || "CRM não especificado"
                }],
                name: [{
                  use: "official",
                  text: item.nome || item.name || "Nome não especificado"
                }]
              }
            };
          case 'Organization':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                name: item.nome || item.name || item.hospital || "Hospital não especificado",
                identifier: [{
                  system: "http://saude.gov.br/cnes",
                  value: item.cnes || item.code || "Código não especificado"
                }]
              }
            };
          default:
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                ...item
              }
            };
        }
      })
    };

    // Converter para JSON e fazer download
    const jsonString = JSON.stringify(fhirBundle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/fhir+json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Arquivo FHIR exportado com sucesso', {
      description: `O arquivo ${filename}.json foi baixado com sucesso.`
    });
  } catch (error) {
    console.error('Erro ao exportar dados para formato FHIR:', error);
    toast.error('Falha ao exportar para formato FHIR');
  }
}
