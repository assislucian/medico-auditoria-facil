
// Standardized response utilities

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

export function buildErrorResponse(error: { message: string; status: number }) {
  return new Response(
    JSON.stringify({ success: false, error: error.message }),
    { headers: corsHeaders, status: error.status }
  );
}

export function buildSuccessResponse(reportType: string, reportData: any) {
  return new Response(
    JSON.stringify({ success: true, reportType, reportData }),
    { headers: corsHeaders, status: 200 }
  );
}

export function buildCORSResponse() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

