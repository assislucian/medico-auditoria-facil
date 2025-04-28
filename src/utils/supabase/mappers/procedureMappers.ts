
import { Json } from '@/integrations/supabase/types';
import { DoctorParticipation } from '../types/procedures';

/**
 * Helper function to safely map doctors data
 */
export function mapDoctorsData(doctorsData: Json | null): DoctorParticipation[] {
  if (!doctorsData) return [];
  
  try {
    if (Array.isArray(doctorsData)) {
      return doctorsData.map(doctor => {
        const docObj = doctor as any;
        return {
          id: typeof docObj.id === 'string' ? docObj.id : '',
          name: typeof docObj.name === 'string' ? docObj.name : undefined,
          role: typeof docObj.role === 'string' ? docObj.role : undefined,
          crm: typeof docObj.crm === 'string' ? docObj.crm : undefined,
          value: typeof docObj.value === 'number' ? docObj.value : undefined
        };
      });
    }
  } catch (e) {
    console.error('Error parsing doctors data:', e);
  }
  
  return [];
}

/**
 * Map database fields to Procedure type
 */
export function mapProcedureData(item: any) {
  return {
    id: item.id,
    codigo: item.codigo,
    procedimento: item.procedimento,
    papel: item.papel || '',
    valorCBHPM: item.valor_cbhpm || 0,
    valorPago: item.valor_pago || 0,
    diferenca: item.diferenca || 0,
    pago: !!item.pago,
    guia: item.guia || '',
    beneficiario: item.beneficiario || '',
    doctors: mapDoctorsData(item.doctors)
  };
}
