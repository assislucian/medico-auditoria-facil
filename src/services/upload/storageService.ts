
/**
 * storageService.ts
 * 
 * Serviço para interação com o Supabase Storage.
 * Gerencia o upload, download e exclusão de arquivos no storage.
 */

import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FileWithStatus } from '@/types/upload';

/**
 * Upload files to Supabase storage
 * @param files Arquivos a fazer upload
 * @returns Array com informações dos arquivos enviados
 */
export async function uploadFilesToStorage(files: FileWithStatus[]) {
  try {
    console.log('Iniciando upload para storage, arquivos:', files.length);
    
    // Verificar autenticação do usuário
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Authentication required for file uploads:', sessionError);
      throw new Error('Authentication required for file uploads');
    }

    // Processar cada arquivo
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          // Criar caminho do arquivo no Storage
          const filePath = `${session.user.id}/${Date.now()}-${file.name}`;
          
          // Fazer upload do arquivo
          const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, file.file, {
              cacheControl: '3600',
              upsert: true,
            });
          
          if (error) {
            console.error('Erro no upload do arquivo:', error);
            throw error;
          }
          
          // Registrar upload na base de dados
          const { data: uploadData, error: uploadError } = await supabase
            .from('uploads')
            .insert({
              user_id: session.user.id,
              file_name: file.name,
              file_type: file.type,
              file_path: data.path,
              status: 'processando'
            })
            .select('id')
            .single();
          
          if (uploadError) {
            console.error('Erro ao registrar upload:', uploadError);
            throw uploadError;
          }
          
          console.log('Arquivo enviado com sucesso:', data.path);
          
          // Retornar informações do upload
          return {
            id: uploadData.id,
            name: file.name,
            type: file.type,
            path: data.path,
            url: supabase.storage.from('uploads').getPublicUrl(data.path).data.publicUrl
          };
        } catch (fileError) {
          console.error(`Erro processando arquivo ${file.name}:`, fileError);
          
          // Retornar erro para este arquivo específico
          return {
            id: null,
            name: file.name,
            type: file.type,
            error: fileError.message || 'Erro desconhecido no upload'
          };
        }
      })
    );
    
    // Filtrar apenas resultados de sucesso
    const successfulUploads = uploadResults.filter(r => r.id !== null);
    console.log('Uploads concluídos:', successfulUploads.length);
    
    if (successfulUploads.length === 0) {
      toast.error('Falha no upload dos arquivos');
      throw new Error('Nenhum arquivo foi enviado com sucesso');
    }
    
    return successfulUploads;
  } catch (error) {
    console.error('Erro no serviço de upload:', error);
    toast.error('Erro ao enviar arquivos');
    throw error;
  }
}

/**
 * Get file URL from Storage
 * @param path Caminho do arquivo no Storage
 * @returns URL pública do arquivo
 */
export function getFileUrl(path: string): string {
  return supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl;
}

/**
 * Download file from Storage
 * @param path Caminho do arquivo no Storage
 * @returns Blob do arquivo baixado
 */
export async function downloadFile(path: string): Promise<Blob> {
  const { data, error } = await supabase.storage.from('uploads').download(path);
  
  if (error) {
    console.error('Erro ao baixar arquivo:', error);
    throw error;
  }
  
  return data;
}

/**
 * Delete file from Storage
 * @param path Caminho do arquivo no Storage
 * @returns Booleano indicando sucesso
 */
export async function deleteFile(path: string): Promise<boolean> {
  const { error } = await supabase.storage.from('uploads').remove([path]);
  
  if (error) {
    console.error('Erro ao excluir arquivo:', error);
    return false;
  }
  
  return true;
}
