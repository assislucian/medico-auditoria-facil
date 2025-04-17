
/**
 * Zod schemas for data validation
 * Provides validation schemas for file uploads, processing, and data persistence
 */
import { z } from 'zod';
import { FileType, FileStatus, ProcessingStage, ProcessMode } from './types';

/**
 * Schema for single file upload validation
 */
export const fileWithStatusSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.enum(['guia', 'demonstrativo'] as const),
  file: z.instanceof(File),
  status: z.enum(['valid', 'invalid', 'processing'] as const).optional().default('processing'),
});

/**
 * Schema for multiple file upload validation
 */
export const multipleFileUploadSchema = z.object({
  files: z.array(fileWithStatusSchema),
  crmRegistrado: z.string().optional(),
});

/**
 * Schema for procedure data
 */
export const procedureSchema = z.object({
  codigo: z.string(),
  procedimento: z.string(),
  papel: z.string().optional(),
  valorCBHPM: z.number(),
  valorPago: z.number(),
  diferenca: z.number(),
  pago: z.boolean(),
  guia: z.string().optional(),
  beneficiario: z.string().optional(),
  doctors: z.array(z.any()).optional(),
});

/**
 * Schema for extracted data validation
 */
export const extractedDataSchema = z.object({
  demonstrativoInfo: z.object({
    numero: z.string(),
    competencia: z.string(),
    hospital: z.string(),
    data: z.string(),
    beneficiario: z.string(),
  }),
  procedimentos: z.array(procedureSchema),
  totais: z.object({
    valorCBHPM: z.number(),
    valorPago: z.number(),
    diferenca: z.number(),
    procedimentosNaoPagos: z.number(),
  }),
});
