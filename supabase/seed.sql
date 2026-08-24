-- FUTNEX CLUB — seed inicial (Fase 3)
-- Popula times (Brasil, Europa, Seleções), tamanhos e coleções.
-- Logos ficam null até o admin fazer upload (seção 26 do briefing).

-- ========== TAMANHOS ==========
insert into sizes (code, label, sort_order) values
  ('PP','PP',1), ('P','P',2), ('M','M',3), ('G','G',4),
  ('GG','GG',5), ('XG','XG',6), ('XXG','XXG',7)
on conflict (code) do nothing;

-- ========== COLEÇÕES ==========
insert into collections (name, slug, sort_order) values
  ('Mais Vendidas', 'mais-vendidas', 1),
  ('Lançamentos', 'lancamentos', 2),
  ('Brasileirão', 'brasileirao', 3),
  ('Europa', 'europa', 4),
  ('Seleções', 'selecoes', 5),
  ('Retrô', 'retro', 6),
  ('Clássicas', 'classicas', 7)
on conflict (slug) do nothing;

-- ========== TIMES — BRASIL (Série A 2026) ==========
insert into teams (name, slug, country, continent, league, sort_order) values
  ('Athletico Paranaense','athletico-paranaense','Brasil','America do Sul','Brasileirão Série A',1),
  ('Atlético Mineiro','atletico-mineiro','Brasil','America do Sul','Brasileirão Série A',2),
  ('Bahia','bahia','Brasil','America do Sul','Brasileirão Série A',3),
  ('Botafogo','botafogo','Brasil','America do Sul','Brasileirão Série A',4),
  ('Chapecoense','chapecoense','Brasil','America do Sul','Brasileirão Série A',5),
  ('Corinthians','corinthians','Brasil','America do Sul','Brasileirão Série A',6),
  ('Coritiba','coritiba','Brasil','America do Sul','Brasileirão Série A',7),
  ('Cruzeiro','cruzeiro','Brasil','America do Sul','Brasileirão Série A',8),
  ('Flamengo','flamengo','Brasil','America do Sul','Brasileirão Série A',9),
  ('Fluminense','fluminense','Brasil','America do Sul','Brasileirão Série A',10),
  ('Grêmio','gremio','Brasil','America do Sul','Brasileirão Série A',11),
  ('Internacional','internacional','Brasil','America do Sul','Brasileirão Série A',12),
  ('Mirassol','mirassol','Brasil','America do Sul','Brasileirão Série A',13),
  ('Palmeiras','palmeiras','Brasil','America do Sul','Brasileirão Série A',14),
  ('Red Bull Bragantino','red-bull-bragantino','Brasil','America do Sul','Brasileirão Série A',15),
  ('Remo','remo','Brasil','America do Sul','Brasileirão Série A',16),
  ('Santos','santos','Brasil','America do Sul','Brasileirão Série A',17),
  ('São Paulo','sao-paulo','Brasil','America do Sul','Brasileirão Série A',18),
  ('Vasco da Gama','vasco-da-gama','Brasil','America do Sul','Brasileirão Série A',19),
  ('Vitória','vitoria','Brasil','America do Sul','Brasileirão Série A',20)
on conflict (slug) do nothing;

-- ========== TIMES — INGLATERRA ==========
insert into teams (name, slug, country, continent, league) values
  ('Arsenal','arsenal','Inglaterra','Europa','Premier League'),
  ('Chelsea','chelsea','Inglaterra','Europa','Premier League'),
  ('Liverpool','liverpool','Inglaterra','Europa','Premier League'),
  ('Manchester City','manchester-city','Inglaterra','Europa','Premier League'),
  ('Manchester United','manchester-united','Inglaterra','Europa','Premier League'),
  ('Tottenham','tottenham','Inglaterra','Europa','Premier League'),
  ('Newcastle United','newcastle-united','Inglaterra','Europa','Premier League'),
  ('Aston Villa','aston-villa','Inglaterra','Europa','Premier League'),
  ('West Ham United','west-ham-united','Inglaterra','Europa','Premier League'),
  ('Everton','everton','Inglaterra','Europa','Premier League'),
  ('Brighton','brighton','Inglaterra','Europa','Premier League'),
  ('Crystal Palace','crystal-palace','Inglaterra','Europa','Premier League'),
  ('Fulham','fulham','Inglaterra','Europa','Premier League'),
  ('Nottingham Forest','nottingham-forest','Inglaterra','Europa','Premier League')
on conflict (slug) do nothing;

-- ========== TIMES — ESPANHA ==========
insert into teams (name, slug, country, continent, league) values
  ('Real Madrid','real-madrid','Espanha','Europa','La Liga'),
  ('Barcelona','barcelona','Espanha','Europa','La Liga'),
  ('Atlético de Madrid','atletico-de-madrid','Espanha','Europa','La Liga'),
  ('Athletic Club','athletic-club','Espanha','Europa','La Liga'),
  ('Sevilla','sevilla','Espanha','Europa','La Liga'),
  ('Valencia','valencia','Espanha','Europa','La Liga'),
  ('Villarreal','villarreal','Espanha','Europa','La Liga'),
  ('Real Sociedad','real-sociedad','Espanha','Europa','La Liga'),
  ('Real Betis','real-betis','Espanha','Europa','La Liga'),
  ('Celta de Vigo','celta-de-vigo','Espanha','Europa','La Liga'),
  ('Girona','girona','Espanha','Europa','La Liga')
on conflict (slug) do nothing;

-- ========== TIMES — ITÁLIA ==========
insert into teams (name, slug, country, continent, league) values
  ('Juventus','juventus','Itália','Europa','Serie A'),
  ('Inter','inter-milao','Itália','Europa','Serie A'),
  ('Milan','milan','Itália','Europa','Serie A'),
  ('Napoli','napoli','Itália','Europa','Serie A'),
  ('Roma','roma','Itália','Europa','Serie A'),
  ('Lazio','lazio','Itália','Europa','Serie A'),
  ('Atalanta','atalanta','Itália','Europa','Serie A'),
  ('Fiorentina','fiorentina','Itália','Europa','Serie A'),
  ('Bologna','bologna','Itália','Europa','Serie A'),
  ('Torino','torino','Itália','Europa','Serie A')
on conflict (slug) do nothing;

-- ========== TIMES — ALEMANHA ==========
insert into teams (name, slug, country, continent, league) values
  ('Bayern München','bayern-munchen','Alemanha','Europa','Bundesliga'),
  ('Borussia Dortmund','borussia-dortmund','Alemanha','Europa','Bundesliga'),
  ('Bayer Leverkusen','bayer-leverkusen','Alemanha','Europa','Bundesliga'),
  ('RB Leipzig','rb-leipzig','Alemanha','Europa','Bundesliga'),
  ('Eintracht Frankfurt','eintracht-frankfurt','Alemanha','Europa','Bundesliga'),
  ('Stuttgart','stuttgart','Alemanha','Europa','Bundesliga'),
  ('Wolfsburg','wolfsburg','Alemanha','Europa','Bundesliga'),
  ('Borussia Mönchengladbach','borussia-monchengladbach','Alemanha','Europa','Bundesliga')
on conflict (slug) do nothing;

-- ========== TIMES — FRANÇA / PORTUGAL / HOLANDA / TURQUIA / ESCÓCIA ==========
insert into teams (name, slug, country, continent, league) values
  ('Paris Saint-Germain','paris-saint-germain','França','Europa','Ligue 1'),
  ('Marseille','marseille','França','Europa','Ligue 1'),
  ('Monaco','monaco','França','Europa','Ligue 1'),
  ('Lyon','lyon','França','Europa','Ligue 1'),
  ('Lille','lille','França','Europa','Ligue 1'),
  ('Nice','nice','França','Europa','Ligue 1'),
  ('Benfica','benfica','Portugal','Europa','Primeira Liga'),
  ('Porto','porto','Portugal','Europa','Primeira Liga'),
  ('Sporting CP','sporting-cp','Portugal','Europa','Primeira Liga'),
  ('Braga','braga','Portugal','Europa','Primeira Liga'),
  ('Vitória SC','vitoria-sc','Portugal','Europa','Primeira Liga'),
  ('Ajax','ajax','Holanda','Europa','Eredivisie'),
  ('PSV','psv','Holanda','Europa','Eredivisie'),
  ('Feyenoord','feyenoord','Holanda','Europa','Eredivisie'),
  ('Galatasaray','galatasaray','Turquia','Europa','Süper Lig'),
  ('Fenerbahçe','fenerbahce','Turquia','Europa','Süper Lig'),
  ('Beşiktaş','besiktas','Turquia','Europa','Süper Lig'),
  ('Celtic','celtic','Escócia','Europa','Scottish Premiership'),
  ('Rangers','rangers','Escócia','Europa','Scottish Premiership'),
  ('Club Brugge','club-brugge','Bélgica','Europa','Pro League'),
  ('Anderlecht','anderlecht','Bélgica','Europa','Pro League'),
  ('Olympiacos','olympiacos','Grécia','Europa','Super League'),
  ('Panathinaikos','panathinaikos','Grécia','Europa','Super League'),
  ('Copenhagen','copenhagen','Dinamarca','Europa','Superliga'),
  ('Slavia Praha','slavia-praha','República Tcheca','Europa','Fortuna Liga'),
  ('Red Bull Salzburg','red-bull-salzburg','Áustria','Europa','Bundesliga (AUT)'),
  ('Shakhtar Donetsk','shakhtar-donetsk','Ucrânia','Europa','Premier League (UKR)'),
  ('Dynamo Kyiv','dynamo-kyiv','Ucrânia','Europa','Premier League (UKR)')
on conflict (slug) do nothing;

-- ========== SELEÇÕES ==========
insert into teams (name, slug, country, continent, league) values
  ('Brasil','selecao-brasil','Brasil','America do Sul','Seleção Nacional'),
  ('Argentina','selecao-argentina','Argentina','America do Sul','Seleção Nacional'),
  ('Uruguai','selecao-uruguai','Uruguai','America do Sul','Seleção Nacional'),
  ('Colômbia','selecao-colombia','Colômbia','America do Sul','Seleção Nacional'),
  ('Chile','selecao-chile','Chile','America do Sul','Seleção Nacional'),
  ('Peru','selecao-peru','Peru','America do Sul','Seleção Nacional'),
  ('Equador','selecao-equador','Equador','America do Sul','Seleção Nacional'),
  ('Paraguai','selecao-paraguai','Paraguai','America do Sul','Seleção Nacional'),
  ('Venezuela','selecao-venezuela','Venezuela','America do Sul','Seleção Nacional'),
  ('Bolívia','selecao-bolivia','Bolívia','America do Sul','Seleção Nacional'),
  ('França','selecao-franca','França','Europa','Seleção Nacional'),
  ('Inglaterra','selecao-inglaterra','Inglaterra','Europa','Seleção Nacional'),
  ('Espanha','selecao-espanha','Espanha','Europa','Seleção Nacional'),
  ('Portugal','selecao-portugal','Portugal','Europa','Seleção Nacional'),
  ('Alemanha','selecao-alemanha','Alemanha','Europa','Seleção Nacional'),
  ('Itália','selecao-italia','Itália','Europa','Seleção Nacional'),
  ('Holanda','selecao-holanda','Holanda','Europa','Seleção Nacional'),
  ('Bélgica','selecao-belgica','Bélgica','Europa','Seleção Nacional'),
  ('Croácia','selecao-croacia','Croácia','Europa','Seleção Nacional'),
  ('Dinamarca','selecao-dinamarca','Dinamarca','Europa','Seleção Nacional'),
  ('Suécia','selecao-suecia','Suécia','Europa','Seleção Nacional'),
  ('Noruega','selecao-noruega','Noruega','Europa','Seleção Nacional'),
  ('Suíça','selecao-suica','Suíça','Europa','Seleção Nacional'),
  ('Áustria','selecao-austria','Áustria','Europa','Seleção Nacional'),
  ('Polônia','selecao-polonia','Polônia','Europa','Seleção Nacional'),
  ('Sérvia','selecao-servia','Sérvia','Europa','Seleção Nacional'),
  ('Turquia','selecao-turquia','Turquia','Europa','Seleção Nacional'),
  ('México','selecao-mexico','México','America do Norte','Seleção Nacional'),
  ('Estados Unidos','selecao-estados-unidos','Estados Unidos','America do Norte','Seleção Nacional'),
  ('Canadá','selecao-canada','Canadá','America do Norte','Seleção Nacional'),
  ('Costa Rica','selecao-costa-rica','Costa Rica','America do Norte','Seleção Nacional'),
  ('Marrocos','selecao-marrocos','Marrocos','Africa','Seleção Nacional'),
  ('Egito','selecao-egito','Egito','Africa','Seleção Nacional'),
  ('Senegal','selecao-senegal','Senegal','Africa','Seleção Nacional'),
  ('Nigéria','selecao-nigeria','Nigéria','Africa','Seleção Nacional'),
  ('Camarões','selecao-camaroes','Camarões','Africa','Seleção Nacional'),
  ('Costa do Marfim','selecao-costa-do-marfim','Costa do Marfim','Africa','Seleção Nacional'),
  ('Gana','selecao-gana','Gana','Africa','Seleção Nacional'),
  ('Argélia','selecao-argelia','Argélia','Africa','Seleção Nacional'),
  ('Tunísia','selecao-tunisia','Tunísia','Africa','Seleção Nacional'),
  ('Japão','selecao-japao','Japão','Asia','Seleção Nacional'),
  ('Coreia do Sul','selecao-coreia-do-sul','Coreia do Sul','Asia','Seleção Nacional'),
  ('Irã','selecao-ira','Irã','Asia','Seleção Nacional'),
  ('Arábia Saudita','selecao-arabia-saudita','Arábia Saudita','Asia','Seleção Nacional'),
  ('Austrália','selecao-australia','Austrália','Asia','Seleção Nacional')
on conflict (slug) do nothing;

-- ========== PRODUTOS DEMO (claramente marcados, ver seção 58) ==========
-- Usados apenas para testar a interface antes do cadastro real pelo admin.
do $$
declare
  flamengo_id uuid;
begin
  select id into flamengo_id from teams where slug = 'flamengo';

  if flamengo_id is not null then
    insert into products (
      name, slug, team_id, season, category, description, price,
      is_active, is_featured, is_best_seller, is_new,
      allow_custom_name, allow_custom_number, is_demo
    ) values (
      'Flamengo I 2026 (DEMO)', 'flamengo-i-2026-demo', flamengo_id, '2026', 'casa',
      'Produto de demonstração para testes de interface. Não disponível para venda real até revisão do admin.',
      149.90, true, true, true, true, true, true, true
    )
    on conflict (slug) do nothing;
  end if;
end $$;
