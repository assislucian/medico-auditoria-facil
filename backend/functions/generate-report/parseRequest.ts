
// Request input parsing and validation

export async function parseRequest(req: Request) {
  // Parse JSON body
  const { reportType, startDate, endDate, filters } = await req.json();
  if (!reportType) {
    return {
      error: {
        message: 'Report type is required',
        status: 400
      }
    };
  }
  return { 
    reportType, 
    startDate, 
    endDate, 
    filters 
  };
}

