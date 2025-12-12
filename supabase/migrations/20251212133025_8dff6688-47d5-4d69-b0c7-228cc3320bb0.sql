-- Create folders table (for both folders and items)
CREATE TABLE public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('folder', 'item')),
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  is_auto_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for now)
CREATE POLICY "Allow public read access on folders" 
ON public.folders FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on folders" 
ON public.folders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on folders" 
ON public.folders FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on folders" 
ON public.folders FOR DELETE 
USING (true);

CREATE POLICY "Allow public read access on expenses" 
ON public.expenses FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on expenses" 
ON public.expenses FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on expenses" 
ON public.expenses FOR DELETE 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data - Companies
INSERT INTO public.folders (id, name, type, parent_id, is_auto_generated) VALUES
  ('11111111-1111-1111-1111-111111111111', 'EMPRESA-01', 'folder', NULL, false),
  ('22222222-2222-2222-2222-222222222222', 'EMPRESA-02', 'folder', NULL, false);

-- EMPRESA-02 structure
INSERT INTO public.folders (id, name, type, parent_id, is_auto_generated) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Primeiro Andar', 'folder', '22222222-2222-2222-2222-222222222222', false),
  ('44444444-4444-4444-4444-444444444444', 'Setor Financeiro', 'folder', '33333333-3333-3333-3333-333333333333', false),
  ('55555555-5555-5555-5555-555555555555', 'CALCULADORA-01', 'item', '44444444-4444-4444-4444-444444444444', false),
  ('66666666-6666-6666-6666-666666666666', 'Aquisição', 'folder', '55555555-5555-5555-5555-555555555555', true),
  ('77777777-7777-7777-7777-777777777777', 'Manutenção', 'folder', '55555555-5555-5555-5555-555555555555', true),
  ('88888888-8888-8888-8888-888888888888', 'Documentos', 'folder', '55555555-5555-5555-5555-555555555555', true),
  ('99999999-9999-9999-9999-999999999999', 'Upgrades', 'folder', '55555555-5555-5555-5555-555555555555', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Segundo Andar', 'folder', '22222222-2222-2222-2222-222222222222', false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Setor TI', 'folder', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'PC-DESKTOP-01', 'item', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', false),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Aquisição', 'folder', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Manutenção', 'folder', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Documentos', 'folder', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true),
  ('00000000-0000-0000-0000-000000000001', 'Upgrades', 'folder', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true);

-- Insert demo expenses
INSERT INTO public.expenses (folder_id, category, value, date, description) VALUES
  ('66666666-6666-6666-6666-666666666666', 'Aquisição', 89.90, '2024-01-15', 'Compra da calculadora HP 12C'),
  ('77777777-7777-7777-7777-777777777777', 'Manutenção', 35.00, '2024-06-10', 'Troca de pilhas e limpeza'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Aquisição', 4500.00, '2024-02-20', 'Desktop i7 16GB RAM 512GB SSD'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Manutenção', 150.00, '2024-08-05', 'Limpeza interna e troca de pasta térmica'),
  ('00000000-0000-0000-0000-000000000001', 'Upgrades', 320.00, '2024-09-12', 'Upgrade de RAM para 32GB');