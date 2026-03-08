-- ============================================================
--  banco.sql — Herança dos Ancestrais
--  Execute no Supabase:
--  Painel → SQL Editor → cole o conteúdo → Run
-- ============================================================

-- Tabela de shows
CREATE TABLE IF NOT EXISTS shows (
  id       SERIAL PRIMARY KEY,
  nome     TEXT    NOT NULL,
  local    TEXT    NOT NULL,
  data     DATE    NOT NULL,
  horario  TEXT    NOT NULL,
  ingresso TEXT    DEFAULT '',
  dest     BOOLEAN DEFAULT FALSE,
  mapa     TEXT    DEFAULT ''
);

-- Tabela de fotos
CREATE TABLE IF NOT EXISTS fotos (
  id  SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  cap TEXT DEFAULT 'Foto'
);

-- Tabela de configurações (vídeo, logo)
CREATE TABLE IF NOT EXISTS config (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);

-- Habilitar acesso público às tabelas (necessário para a API funcionar)
ALTER TABLE shows  ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_publico_shows"  ON shows  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_fotos"  ON fotos  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_config" ON config FOR ALL USING (true) WITH CHECK (true);

-- Shows iniciais de exemplo (opcional)
INSERT INTO shows (nome, local, data, horario, ingresso, dest, mapa) VALUES
('Roda de Samba na Pampulha',       'Parque da Pampulha — BH',        '2025-03-15', '16h',   'Gratuito',  TRUE,  'Parque da Pampulha Belo Horizonte'),
('Festival Samba & Cultura Mineira', 'Teatro Francisco Nunes — BH',    '2025-03-22', '19h30', 'R$ 20,00',  FALSE, 'Teatro Francisco Nunes BH'),
('Noite de Samba no Mercado Central','Mercado Central de BH',          '2025-04-05', '18h',   'Gratuito',  FALSE, 'Mercado Central Belo Horizonte'),
('Encontro de Raízes — Contagem',   'Centro Cultural Contagem',        '2025-04-19', '17h',   'R$ 15,00',  FALSE, 'Centro Cultural Contagem MG')
ON CONFLICT DO NOTHING;
