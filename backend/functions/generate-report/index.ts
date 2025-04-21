
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateSummaryReport } from './reports/summary.ts';
import { generateHospitalReport } from './reports/hospital.ts';
import { generateProcedureReport } from './reports/procedure.ts';
import { generateMonthlyReport } from './reports/monthly.ts';
import { parseRequest } from './parseRequest.ts';
import { getAuthenticatedUser } from './auth.ts';
import { fetchAnalyses } from './fetchAnalyses.ts';
import { buildErrorResponse, buildSuccessResponse, buildCORSResponse } from './respond.ts';

// Extended: license validation and crm + role extraction 
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return buildCORSResponse();
  }

  try {
    const authResult = await getAuthenticatedUser(req);
    if ('error' in authResult) return buildErrorResponse(authResult.error);
    const { user } = authResult;

    // Extract crm and role from token user_metadata
    const userMetadata = user.user_metadata || {};
    const crm = userMetadata.crm || null;
    const role = userMetadata.role || null;

    if (!crm || !role) {
      return buildErrorResponse({
        message: 'Missing CRM or role in token',
        status: 401,
      });
    }

    // License validation
    const licenseCheck = await fetch('https://yzrovzblelpnftlegczx.supabase.co/rest/v1/licenses?crm=eq.' + crm + '&active=eq.true', {
      headers: {
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
        Authorization: req.headers.get('Authorization') || '', 
        Accept: 'application/json',
      }
    });
    if (!licenseCheck.ok) {
      return buildErrorResponse({
        message: 'License inactive or not found',
        status: 403,
      });
    }
    const licenseJson = await licenseCheck.json();
    if (!licenseJson.length) {
      return buildErrorResponse({
        message: 'License inactive or not found',
        status: 403,
      });
    }

    const params = await parseRequest(req);
    if ('error' in params) return buildErrorResponse(params.error);
    const { reportType, startDate, endDate, filters } = params;

    console.log(`Generating ${reportType} report for CRM ${crm}, role ${role}, period: ${startDate || 'all'} to ${endDate || 'all'}`);

    // Fetch analyses filtered by crm and role
    const fetchResult = await fetchAnalyses(crm, role, startDate, endDate, filters);
    if ('error' in fetchResult) return buildErrorResponse(fetchResult.error);
    const { analyses } = fetchResult;

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
        return buildErrorResponse({ message: 'Invalid report type', status: 400 });
    }
    return buildSuccessResponse(reportType, reportData);

  } catch (error) {
    console.error('Error generating report:', error);
    return buildErrorResponse({
      message: error.message || 'An unknown error occurred while generating report',
      status: 500,
    });
  }
});
