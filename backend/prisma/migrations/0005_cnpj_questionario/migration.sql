-- CNPJ institucional e relação com questionários.
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS cnpjempresa VARCHAR(14);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS idquestionario INTEGER;
