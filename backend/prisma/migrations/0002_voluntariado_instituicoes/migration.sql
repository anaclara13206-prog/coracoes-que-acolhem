-- Complementa o banco para permitir várias instituições administrativas
-- e várias inscrições de um mesmo usuário, uma por instituição.
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS nomeempresa VARCHAR(120);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS cidadeempresa VARCHAR(80);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS telefoneempresa VARCHAR(20);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS emailempresa VARCHAR(80);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS descricaoempresa TEXT;

ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS idade INTEGER;
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS cidade VARCHAR(80);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS areainteresse VARCHAR(120);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS idadministrador INTEGER;
