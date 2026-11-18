-- Melhorias de backend do TCC Corações que Acolhem
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS nomeempresa VARCHAR(120);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS cidadeempresa VARCHAR(80);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS telefoneempresa VARCHAR(20);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS emailempresa VARCHAR(80);
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS descricaoempresa TEXT;

ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS idade INTEGER;
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS cidade VARCHAR(80);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS areainteresse VARCHAR(120);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS idadministrador INTEGER;
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS data_inicio DATE;
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS data_fim DATE;
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS horario_inicio VARCHAR(10);
ALTER TABLE voluntario ADD COLUMN IF NOT EXISTS horario_fim VARCHAR(10);

ALTER TABLE questionario ADD COLUMN IF NOT EXISTS idusuario INTEGER;
ALTER TABLE questionario ADD COLUMN IF NOT EXISTS idadministrador INTEGER;
ALTER TABLE questionario ADD COLUMN IF NOT EXISTS idvoluntario INTEGER;

ALTER TABLE contato ADD COLUMN IF NOT EXISTS idadministrador INTEGER;
ALTER TABLE doacao ADD COLUMN IF NOT EXISTS idadministrador INTEGER;

ALTER TABLE informacao ADD COLUMN IF NOT EXISTS categoria VARCHAR(60);
ALTER TABLE informacao ADD COLUMN IF NOT EXISTS imagemurl TEXT;

CREATE TABLE IF NOT EXISTS voluntario_presenca (
  idpresenca SERIAL PRIMARY KEY,
  idvoluntario INTEGER NOT NULL,
  datapresenca DATE NOT NULL,
  horainicio VARCHAR(10),
  horafim VARCHAR(10),
  status VARCHAR(20) NOT NULL DEFAULT 'presente',
  observacao TEXT
);

CREATE TABLE IF NOT EXISTS senha_reset (
  idreset SERIAL PRIMARY KEY,
  idusuario INTEGER NOT NULL,
  token VARCHAR(120) NOT NULL UNIQUE,
  expiraem TIMESTAMP NOT NULL,
  usadoem TIMESTAMP
);

ALTER TABLE administrador ADD COLUMN IF NOT EXISTS chavepix TEXT;
ALTER TABLE administrador ADD COLUMN IF NOT EXISTS dadosbancarios TEXT;
ALTER TABLE doacao ADD COLUMN IF NOT EXISTS statusdoacao VARCHAR(40) NOT NULL DEFAULT 'Pendente de confirmação';
