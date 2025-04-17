
/**
 * Edge Function to handle file uploads
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client initialization
const supabaseUrl = 'https://yzrovzblelpnftlegczx.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401 
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }
    
    // Process as multipart form data
    const formData = await req.formData();
    const files = formData.getAll('files');
    const fileType = formData.get('fileType') as string;
    const crmRegistrado = formData.get('crmRegistrado') as string || '';

    // Validate input
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    if (!fileType || !['guia', 'demonstrativo'].includes(fileType)) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    console.log(`Processing ${files.length} ${fileType} files for user ${user.id}, CRM filter: ${crmRegistrado || 'none'}`);

    // Upload files to storage
    const uploadResults = await Promise.all(
      files.map(async (file: File) => {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        // Upload the file
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });
          
        if (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return { 
            name: file.name,
            status: 'failed',
            error: error.message
          };
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(data.path);
        
        // Register the upload
        await supabase.from('uploads').insert({
          user_id: user.id,
          file_name: file.name,
          file_type: fileType,
          file_path: data.path,
          status: 'processando'
        });
        
        return {
          name: file.name,
          status: 'success',
          path: data.path,
          url: publicUrl
        };
      })
    );
    
    // Return the results
    return new Response(JSON.stringify({ 
      success: true,
      results: uploadResults,
      message: `Successfully processed ${uploadResults.filter(r => r.status === 'success').length} files`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An unknown error occurred while processing files'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
