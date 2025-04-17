
-- Medico Auditoria Fácil - Functions and Triggers

-- Function to log actions in activity_logs table
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_description TEXT;
  entity_description TEXT;
BEGIN
  -- Determine the action type
  IF TG_OP = 'INSERT' THEN
    action_description := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_description := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_description := 'deleted';
  END IF;

  -- Determine entity type and description based on table
  IF TG_TABLE_NAME = 'analysis_results' THEN
    entity_description := 'Analysis #' || COALESCE(NEW.numero, NEW.id::text);
  ELSIF TG_TABLE_NAME = 'procedure_results' THEN
    entity_description := 'Procedure ' || NEW.codigo || ' - ' || NEW.procedimento;
  ELSIF TG_TABLE_NAME = 'analysis_history' THEN
    entity_description := COALESCE(NEW.description, 'Analysis history record');
  ELSE
    entity_description := TG_TABLE_NAME || ' record';
  END IF;

  -- Insert activity log
  INSERT INTO public.activity_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    description
  ) VALUES (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.user_id
      ELSE NEW.user_id
    END,
    action_description,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    action_description || ' ' || entity_description
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for activity logging
CREATE TRIGGER log_analysis_results_activity
AFTER INSERT OR UPDATE OR DELETE ON public.analysis_results
FOR EACH ROW EXECUTE PROCEDURE public.log_activity();

CREATE TRIGGER log_analysis_history_activity
AFTER INSERT OR UPDATE OR DELETE ON public.analysis_history
FOR EACH ROW EXECUTE PROCEDURE public.log_activity();

-- Function to verify CRM in auth
CREATE OR REPLACE FUNCTION public.verify_crm(crm_to_verify TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.profiles
    WHERE crm = crm_to_verify
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate CBHPM value from code
CREATE OR REPLACE FUNCTION public.calculate_cbhpm_value(codigo TEXT)
RETURNS NUMERIC AS $$
DECLARE
  cbhpm_value NUMERIC;
BEGIN
  SELECT COALESCE(NULLIF(valor_cirurgiao, '')::NUMERIC, 0)
  FROM public.CBHPM2015
  WHERE codigo::TEXT = calculate_cbhpm_value.codigo
  INTO cbhpm_value;
  
  RETURN COALESCE(cbhpm_value, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
