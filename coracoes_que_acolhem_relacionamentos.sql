-- Corações que Acolhem - chaves estrangeiras para o Supabase
-- Baseado nos campos presentes no schema.prisma e nas consultas/serviços do backend.
-- Não apaga nem recria tabelas ou registros.
-- Execute no SQL Editor do Supabase, no schema public.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_administrador_usuario') THEN
    ALTER TABLE public.administrador
      ADD CONSTRAINT fk_administrador_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_voluntario_usuario') THEN
    ALTER TABLE public.voluntario
      ADD CONSTRAINT fk_voluntario_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_voluntario_questionario') THEN
    ALTER TABLE public.voluntario
      ADD CONSTRAINT fk_voluntario_questionario
      FOREIGN KEY (idquestionario) REFERENCES public.questionario (idquestionario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_voluntario_administrador') THEN
    ALTER TABLE public.voluntario
      ADD CONSTRAINT fk_voluntario_administrador
      FOREIGN KEY (idadministrador) REFERENCES public.administrador (idadministrador)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_doacao_usuario') THEN
    ALTER TABLE public.doacao
      ADD CONSTRAINT fk_doacao_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_doacao_administrador') THEN
    ALTER TABLE public.doacao
      ADD CONSTRAINT fk_doacao_administrador
      FOREIGN KEY (idadministrador) REFERENCES public.administrador (idadministrador)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_informacao_administrador') THEN
    ALTER TABLE public.informacao
      ADD CONSTRAINT fk_informacao_administrador
      FOREIGN KEY (idadministrador) REFERENCES public.administrador (idadministrador)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_questionario_usuario') THEN
    ALTER TABLE public.questionario
      ADD CONSTRAINT fk_questionario_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_questionario_administrador') THEN
    ALTER TABLE public.questionario
      ADD CONSTRAINT fk_questionario_administrador
      FOREIGN KEY (idadministrador) REFERENCES public.administrador (idadministrador)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_questionario_voluntario') THEN
    ALTER TABLE public.questionario
      ADD CONSTRAINT fk_questionario_voluntario
      FOREIGN KEY (idvoluntario) REFERENCES public.voluntario (idvoluntario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_contato_usuario') THEN
    ALTER TABLE public.contato
      ADD CONSTRAINT fk_contato_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_contato_administrador') THEN
    ALTER TABLE public.contato
      ADD CONSTRAINT fk_contato_administrador
      FOREIGN KEY (idadministrador) REFERENCES public.administrador (idadministrador)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_voluntario_presenca_voluntario') THEN
    ALTER TABLE public.voluntario_presenca
      ADD CONSTRAINT fk_voluntario_presenca_voluntario
      FOREIGN KEY (idvoluntario) REFERENCES public.voluntario (idvoluntario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_senha_reset_usuario') THEN
    ALTER TABLE public.senha_reset
      ADD CONSTRAINT fk_senha_reset_usuario
      FOREIGN KEY (idusuario) REFERENCES public.usuario (idusuario)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

-- Conferência: deve listar 14 chaves estrangeiras.
SELECT
  tc.table_name AS tabela,
  kcu.column_name AS coluna,
  ccu.table_name AS tabela_referenciada,
  ccu.column_name AS coluna_referenciada,
  tc.constraint_name AS restricao
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.constraint_schema = tc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.constraint_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
