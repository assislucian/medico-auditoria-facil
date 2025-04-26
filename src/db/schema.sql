
-- This is a schema for the medical data tables

-- Table for payment statements
CREATE TABLE IF NOT EXISTS payment_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  periodo TEXT NOT NULL,
  nome TEXT NOT NULL,
  crm TEXT NOT NULL,
  cpf TEXT NOT NULL,
  total_consultas NUMERIC DEFAULT 0,
  total_honorarios NUMERIC DEFAULT 0,
  total_geral NUMERIC DEFAULT 0,
  qtd_procedimentos INTEGER DEFAULT 0,
  qtd_glosas INTEGER DEFAULT 0,
  valor_glosas NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to payment_statements
ALTER TABLE payment_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payment statements" ON payment_statements 
  FOR ALL USING (auth.uid() = user_id);

-- Table for statement procedures
CREATE TABLE IF NOT EXISTS statement_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id UUID REFERENCES payment_statements NOT NULL,
  lote TEXT,
  conta TEXT,
  guia TEXT NOT NULL,
  data TEXT,
  carteira TEXT,
  nome TEXT,
  acomodacao TEXT,
  codigo_servico TEXT NOT NULL,
  descricao_servico TEXT NOT NULL,
  quantidade INTEGER DEFAULT 1,
  valor_apresentado NUMERIC DEFAULT 0,
  valor_liberado NUMERIC DEFAULT 0,
  pro_rata NUMERIC DEFAULT 0,
  glosa NUMERIC DEFAULT 0,
  tipo TEXT CHECK (tipo IN ('consulta', 'honorario', 'outro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to statement_procedures
ALTER TABLE statement_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own statement procedures" ON statement_procedures 
  USING (EXISTS (SELECT 1 FROM payment_statements ps WHERE ps.id = statement_id AND ps.user_id = auth.uid()));

-- Table for statement glosas
CREATE TABLE IF NOT EXISTS statement_glosas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id UUID REFERENCES payment_statements NOT NULL,
  conta TEXT,
  guia TEXT NOT NULL,
  data TEXT,
  nome TEXT,
  codigo_servico TEXT NOT NULL,
  descricao_servico TEXT NOT NULL,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to statement_glosas
ALTER TABLE statement_glosas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own statement glosas" ON statement_glosas 
  USING (EXISTS (SELECT 1 FROM payment_statements ps WHERE ps.id = statement_id AND ps.user_id = auth.uid()));

-- Table for medical guides
CREATE TABLE IF NOT EXISTS medical_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  numero TEXT NOT NULL,
  data_execucao TEXT,
  beneficiario_codigo TEXT,
  beneficiario_nome TEXT NOT NULL,
  prestador_codigo TEXT,
  prestador_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to medical_guides
ALTER TABLE medical_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own medical guides" ON medical_guides 
  FOR ALL USING (auth.uid() = user_id);

-- Table for guide procedures
CREATE TABLE IF NOT EXISTS guide_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES medical_guides NOT NULL,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_execucao TEXT,
  quantidade INTEGER DEFAULT 1,
  status TEXT,
  valor_pago NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to guide_procedures
ALTER TABLE guide_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own guide procedures" ON guide_procedures 
  USING (EXISTS (SELECT 1 FROM medical_guides mg WHERE mg.id = guide_id AND mg.user_id = auth.uid()));

-- Table for guide participations
CREATE TABLE IF NOT EXISTS guide_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID REFERENCES guide_procedures NOT NULL,
  funcao TEXT NOT NULL,
  crm TEXT NOT NULL,
  nome TEXT NOT NULL,
  data_inicio TEXT,
  data_fim TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to guide_participations
ALTER TABLE guide_participations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own guide participations" ON guide_participations 
  USING (EXISTS (
    SELECT 1 FROM guide_procedures gp 
    JOIN medical_guides mg ON gp.guide_id = mg.id 
    WHERE gp.id = procedure_id AND mg.user_id = auth.uid()
  ));
