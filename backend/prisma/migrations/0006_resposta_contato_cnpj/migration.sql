-- Campos complementares para identificar a instituição, responder contatos e armazenar hashes de senha.
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS cnpjempresa VARCHAR(14);
ALTER TABLE contato ADD COLUMN IF NOT EXISTS respostacontato TEXT;
ALTER TABLE contato ADD COLUMN IF NOT EXISTS dataresposta TIMESTAMP;
ALTER TABLE usuario ALTER COLUMN senhausuario TYPE VARCHAR(255);
