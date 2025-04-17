
-- Medico Auditoria Fácil - Database Schema

-- Enable Row-Level Security for existing tables
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analysis_history
CREATE POLICY "Users can only access their own analysis history"
  ON public.analysis_history
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for analysis_results
CREATE POLICY "Users can only access their own analysis results"
  ON public.analysis_results
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for procedure_results
CREATE POLICY "Users can access procedure results of their analyses"
  ON public.procedure_results
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.analysis_results
      WHERE analysis_results.id = procedure_results.analysis_id
        AND analysis_results.user_id = auth.uid()
    )
  );

-- Create RLS policies for uploads
CREATE POLICY "Users can only access their own uploads"
  ON public.uploads
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_procedure_results_analysis_id ON public.procedure_results(analysis_id);
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);
