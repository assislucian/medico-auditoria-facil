
/**
 * Zod schemas for validation
 */
import { z } from 'zod';

/**
 * Schema for doctor participation in a procedure
 */
export const doctorParticipationSchema = z.object({
  code: z.string(),
  name: z.string(),
  role: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string()
});

/**
 * Schema for an extracted procedure
 */
export const procedureExtractedSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  procedimento: z.string(),
  papel: z.string(),
  valorCBHPM: z.number(),
  valorPago: z.number(),
  diferenca: z.number(),
  pago: z.boolean(),
  guia: z.string(),
  beneficiario: z.string(),
  doctors: z.array(doctorParticipationSchema)
});

/**
 * Schema for demonstrativo information
 */
export const demonstrativoInfoSchema = z.object({
  numero: z.string(),
  competencia: z.string(),
  hospital: z.string(),
  data: z.string(),
  beneficiario: z.string()
});

/**
 * Schema for processing totals
 */
export const processingTotalsSchema = z.object({
  valorCBHPM: z.number(),
  valorPago: z.number(),
  diferenca: z.number(),
  procedimentosNaoPagos: z.number()
});

/**
 * Schema for extracted data from documents
 */
export const extractedDataSchema = z.object({
  demonstrativoInfo: demonstrativoInfoSchema,
  procedimentos: z.array(procedureExtractedSchema),
  totais: processingTotalsSchema
});

/**
 * Schema for file upload validation
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['guia', 'demonstrativo']),
  name: z.string()
});

/**
 * Schema for uploading multiple files
 */
export const multipleFileUploadSchema = z.object({
  files: z.array(fileUploadSchema),
  crmRegistrado: z.string().optional()
});

/**
 * Schema for saving analysis results
 */
export const analysisResultSchema = z.object({
  user_id: z.string().uuid(),
  file_name: z.string(),
  file_type: z.string(),
  hospital: z.string().optional(),
  competencia: z.string().optional(),
  numero: z.string().optional(),
  summary: z.record(z.any())
});

/**
 * Schema for saving procedure results
 */
export const procedureResultSchema = z.object({
  analysis_id: z.string().uuid(),
  codigo: z.string(),
  procedimento: z.string(),
  papel: z.string().optional(),
  valor_cbhpm: z.number(),
  valor_pago: z.number(),
  diferenca: z.number(),
  pago: z.boolean(),
  guia: z.string().optional(),
  beneficiario: z.string().optional(),
  doctors: z.array(doctorParticipationSchema).optional()
});
