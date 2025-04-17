
/**
 * Service to handle file uploads and processing
 */
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { ExtractedData, FileWithStatus, ProcessMode } from '../models/types';
import { multipleFileUploadSchema } from '../models/schemas';
import { extractDataFromFiles } from './processingService';
import { saveAnalysisToDatabase } from './databaseService';

/**
 * Upload files to storage
 * @param files Files to upload
 * @returns Array of file URLs
 */
export async function uploadFilesToStorage(files: FileWithStatus[]): Promise<string[]> {
  const fileUrls: string[] = [];
  const validFiles = files.filter(f => f.status === 'valid');
  
  try {
    logger.info('Beginning file upload to storage', { fileCount: validFiles.length });
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.error('Attempt to upload files without authenticated user');
      throw new Error('User not authenticated');
    }
    
    // Check if the storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const uploadsBucketExists = buckets?.some(b => b.name === 'uploads');
    
    if (!uploadsBucketExists) {
      logger.info('Creating uploads bucket');
      await supabase.storage.createBucket('uploads', { public: false });
    }
    
    // Upload each file
    for (const file of validFiles) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      logger.debug('Uploading file', { fileName, fileType: file.type });
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file.file, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (error) {
        logger.error('Error uploading file', { fileName, error });
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path);
        
      fileUrls.push(publicUrl);
      
      // Register the upload in the database
      await supabase.from('uploads').insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_path: data.path,
        status: 'processado'
      });
      
      logger.debug('File uploaded successfully', { fileName, path: data.path });
    }
    
    logger.info('File upload completed', { uploadedFiles: fileUrls.length });
    return fileUrls;
  } catch (error) {
    logger.error('Error in uploadFilesToStorage', { error });
    return fileUrls;
  }
}

/**
 * Get processing mode based on file types
 * @param hasGuias Whether there are TISS guide files
 * @param hasDemonstrativos Whether there are fee statement files
 * @returns Processing mode
 */
export function getProcessMode(hasGuias: boolean, hasDemonstrativos: boolean): ProcessMode {
  if (hasGuias && hasDemonstrativos) {
    return 'complete';
  } else if (hasGuias) {
    return 'guia-only';
  } else {
    return 'demonstrativo-only';
  }
}

/**
 * Process uploaded files
 * @param files Files to process
 * @param setProgress Progress callback
 * @param setProcessingStage Processing stage callback
 * @param setProcessingMsg Processing message callback
 * @param crmRegistrado CRM to filter by
 * @returns Success status
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress?: (progress: number) => void,
  setProcessingStage?: (stage: string) => void,
  setProcessingMsg?: (msg: string) => void,
  crmRegistrado: string = ''
): Promise<{ success: boolean; analysisId: string | null }> {
  try {
    // Validate files using Zod
    const validationResult = multipleFileUploadSchema.safeParse({ 
      files, 
      crmRegistrado 
    });
    
    if (!validationResult.success) {
      logger.error('File validation failed', { errors: validationResult.error });
      return { success: false, analysisId: null };
    }
    
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    // Determine processing mode
    const processMode = getProcessMode(hasGuias, hasDemonstrativos);
    
    logger.info('Beginning file processing', { 
      processMode,
      filesCount: files.length,
      hasGuias,
      hasDemonstrativos,
      crmRegistrado: crmRegistrado || 'none'
    });
    
    // Update progress if callback provided
    if (setProgress) setProgress(10);
    if (setProcessingStage) setProcessingStage('extracting');
    if (setProcessingMsg) setProcessingMsg('Extracting data from files...');
    
    // Upload files to storage
    await uploadFilesToStorage(files);
    
    if (setProgress) setProgress(30);
    if (setProcessingStage) setProcessingStage('analyzing');
    if (setProcessingMsg) setProcessingMsg('Analyzing procedures...');
    
    // Extract data from files
    const extractedData = await extractDataFromFiles(files, processMode, crmRegistrado);
    
    if (setProgress) setProgress(60);
    if (setProcessingStage) setProcessingStage('comparing');
    if (setProcessingMsg) setProcessingMsg('Comparing values with CBHPM reference...');
    
    // Save to database
    const result = await saveAnalysisToDatabase(files, processMode, extractedData);
    
    if (setProgress) setProgress(100);
    if (setProcessingStage) setProcessingStage('complete');
    if (setProcessingMsg) setProcessingMsg('Processing completed successfully!');
    
    logger.info('File processing completed', { 
      success: result.success, 
      analysisId: result.analysisId 
    });
    
    return result;
  } catch (error) {
    logger.error('Error in processFiles', { error });
    if (setProcessingStage) setProcessingStage('error');
    if (setProcessingMsg) setProcessingMsg('Error processing files. Please try again.');
    return { success: false, analysisId: null };
  }
}
