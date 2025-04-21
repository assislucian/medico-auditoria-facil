
/**
 * Edge Function to generate analysis reports (modularized version)
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Generators
import { generateSummaryReport } from './reports/summary.ts';
import { generateHospitalReport } from './reports/hospital.ts';
import { generateProcedureReport } from './reports/procedure.ts';
import { generateMonthlyReport } from './reports/monthly.ts';

// Helpers
import { parseRequest } from './parseRequest.ts';
import { getAuthenticatedUser } from './auth.ts';
import { fetchAnalyses } from './fetchAnalyses.ts';
import { buildErrorResponse, buildSuccessResponse, buildCORSResponse } from './respond.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return buildCORSResponse();
  }

  try {
    // Auth
    const authResult = await getAuthenticatedUser(req);
    if ("error" in authResult) return buildErrorResponse(authResult.error);
    const { user } = authResult;

    // Parse body
    const params = await parseRequest(req);
    if ("error" in params) return buildErrorResponse(params.error);
    const { reportType, startDate, endDate, filters } = params;

    // Logging
    console.log(`Generating ${reportType} report for user ${user.id}, period: ${startDate || 'all'} to ${endDate || 'all'}`);

    // Fetch data
    const fetchResult = await fetchAnalyses(user.id, startDate, endDate, filters);
    if ("error" in fetchResult) return buildErrorResponse(fetchResult.error);
    const { analyses } = fetchResult;

    // Generate report
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
      status: 500
    });
  }
});
