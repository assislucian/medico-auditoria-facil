
/**
 * Edge Function to generate analysis reports
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import report generators
import { generateSummaryReport } from './reports/summary.ts';
import { generateHospitalReport } from './reports/hospital.ts';
import { generateProcedureReport } from './reports/procedure.ts';
import { generateMonthlyReport } from './reports/monthly.ts';

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
    
    // Get request body
    const { reportType, startDate, endDate, filters } = await req.json();
    
    // Validate input
    if (!reportType) {
      return new Response(JSON.stringify({ error: 'Report type is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    console.log(`Generating ${reportType} report for user ${user.id}, period: ${startDate || 'all'} to ${endDate || 'all'}`);
    
    // Apply date filters if provided
    let query = supabase
      .from('analysis_results')
      .select('*, procedure_results(*)')
      .eq('user_id', user.id);
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Apply additional filters if provided
    if (filters) {
      if (filters.hospital) {
        query = query.eq('hospital', filters.hospital);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }
    
    // Fetch data
    const { data: analyses, error: analysesError } = await query;
    
    if (analysesError) {
      return new Response(JSON.stringify({ 
        success: false,
        error: analysesError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Process data based on report type
    let reportData;
    
    switch (reportType) {
      case 'summary':
        reportData = generateSummaryReport(analyses, startDate, endDate);
        break;
      case 'hospital':
        reportData = generateHospitalReport(analyses, startDate, endDate);
        break;
      case 'procedure':
        reportData = generateProcedureReport(analyses, startDate, endDate);
        break;
      case 'monthly':
        reportData = generateMonthlyReport(analyses, startDate, endDate);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid report type' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
    }
    
    // Return the report data
    return new Response(JSON.stringify({ 
      success: true,
      reportType,
      reportData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error generating report:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An unknown error occurred while generating report'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
