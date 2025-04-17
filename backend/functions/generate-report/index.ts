
/**
 * Edge Function to generate analysis reports
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

// Generate summary report
function generateSummaryReport(analyses, startDate, endDate) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Calculate summary values
  const summary = analyses.reduce((acc, analysis) => {
    const summaryData = analysis.summary || {};
    
    acc.totalRecebido += Number(summaryData.totalPago || 0);
    acc.totalGlosado += Math.abs(Number(summaryData.totalDiferenca || 0));
    acc.totalProcedimentos += Number(summaryData.procedimentosTotal || 0);
    return acc;
  }, {
    totalRecebido: 0,
    totalGlosado: 0,
    totalProcedimentos: 0,
    auditoriaPendente: 0
  });
  
  // Count pending analyses
  summary.auditoriaPendente = analyses.filter(a => a.status === 'Pendente').length;
  
  return {
    period,
    summary
  };
}

// Generate hospital report
function generateHospitalReport(analyses, startDate, endDate) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Group by hospital
  const hospitalMap = new Map();
  
  analyses.forEach(analysis => {
    const hospital = analysis.hospital || 'Desconhecido';
    const summary = analysis.summary || {};
    
    if (!hospitalMap.has(hospital)) {
      hospitalMap.set(hospital, {
        name: hospital,
        procedimentos: 0,
        glosados: 0,
        recuperados: 0
      });
    }
    
    const hospitalData = hospitalMap.get(hospital);
    hospitalData.procedimentos += Number(summary.procedimentosTotal || 0);
    hospitalData.glosados += Number(summary.procedimentosNaoPagos || 0);
    hospitalData.recuperados += Math.round(Number(summary.procedimentosNaoPagos || 0) * 0.3);
  });
  
  // Calculate summary values
  const summary = {
    totalRecebido: analyses.reduce((sum, a) => sum + Number((a.summary?.totalPago || 0)), 0),
    totalGlosado: analyses.reduce((sum, a) => sum + Math.abs(Number((a.summary?.totalDiferenca || 0))), 0),
    totalProcedimentos: analyses.reduce((sum, a) => sum + Number((a.summary?.procedimentosTotal || 0)), 0),
    auditoriaPendente: analyses.filter(a => a.status === 'Pendente').length
  };
  
  return {
    period,
    summary,
    hospitalData: Array.from(hospitalMap.values())
  };
}

// Generate procedure report
function generateProcedureReport(analyses, startDate, endDate) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Extract all procedures
  const procedures = analyses.flatMap(a => a.procedure_results);
  
  // Group by procedure code
  const procedureMap = new Map();
  
  procedures.forEach(proc => {
    if (!proc) return;
    
    if (!procedureMap.has(proc.codigo)) {
      procedureMap.set(proc.codigo, {
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        count: 0,
        valorCBHPM: 0,
        valorPago: 0,
        diferenca: 0
      });
    }
    
    const procData = procedureMap.get(proc.codigo);
    procData.count += 1;
    procData.valorCBHPM += Number(proc.valor_cbhpm || 0);
    procData.valorPago += Number(proc.valor_pago || 0);
    procData.diferenca += Number(proc.diferenca || 0);
  });
  
  // Sort by count and take top 10
  const topProcedures = Array.from(procedureMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate summary values
  const summary = {
    totalRecebido: analyses.reduce((sum, a) => sum + Number((a.summary?.totalPago || 0)), 0),
    totalGlosado: analyses.reduce((sum, a) => sum + Math.abs(Number((a.summary?.totalDiferenca || 0))), 0),
    totalProcedimentos: analyses.reduce((sum, a) => sum + Number((a.summary?.procedimentosTotal || 0)), 0),
    auditoriaPendente: analyses.filter(a => a.status === 'Pendente').length
  };
  
  return {
    period,
    summary,
    procedureData: topProcedures
  };
}

// Generate monthly report
function generateMonthlyReport(analyses, startDate, endDate) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Group by month
  const monthlyMap = new Map();
  
  analyses.forEach(analysis => {
    const date = new Date(analysis.created_at);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    const summary = analysis.summary || {};
    
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, {
        name: month,
        recebido: 0,
        glosado: 0
      });
    }
    
    const monthData = monthlyMap.get(month);
    monthData.recebido += Number(summary.totalPago || 0);
    monthData.glosado += Math.abs(Number(summary.totalDiferenca || 0));
  });
  
  // Calculate summary values
  const summary = {
    totalRecebido: analyses.reduce((sum, a) => sum + Number((a.summary?.totalPago || 0)), 0),
    totalGlosado: analyses.reduce((sum, a) => sum + Math.abs(Number((a.summary?.totalDiferenca || 0))), 0),
    totalProcedimentos: analyses.reduce((sum, a) => sum + Number((a.summary?.procedimentosTotal || 0)), 0),
    auditoriaPendente: analyses.filter(a => a.status === 'Pendente').length
  };
  
  return {
    period,
    summary,
    monthlyData: Array.from(monthlyMap.values())
  };
}
