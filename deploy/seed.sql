insert into pessoas (
  id, codigo, nome, documento_fiscal, identidade, data_nascimento,
  cidade_nascimento, pais, profissao, renda, tipo_logradouro,
  logradouro, numero, complemento, bairro, cidade, estado, cep
) values
  (
    '11111111-1111-1111-1111-111111111111', 'P001', 'Carlos Henrique Almeida', '123.456.789-00', 'MG-10.203.405', '1982-04-11',
    'Belo Horizonte', 'Brasil', 'Engenheiro civil', 18500, 'Avenida',
    'Afonso Pena', '1200', 'Sala 402', 'Centro', 'Belo Horizonte', 'Minas Gerais', '30130-003'
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'P002', 'Fernanda Oliveira Souza', '987.654.321-00', 'SP-22.101.444', '1990-09-02',
    'Sao Paulo', 'Brasil', 'Arquiteta', 12400, 'Rua',
    'Dos Pinheiros', '88', 'Apto 52', 'Pinheiros', 'Sao Paulo', 'Sao Paulo', '05422-000'
  ),
  (
    '33333333-3333-3333-3333-333333333333', 'P003', 'Mariana Costa Ribeiro', '111.222.333-44', 'RJ-55.203.009', '1978-01-25',
    'Niteroi', 'Brasil', 'Medica', 26800, 'Praca',
    'Praca da Liberdade', '14', '', 'Funcionarios', 'Belo Horizonte', 'Minas Gerais', '30140-010'
  )
on conflict (id) do update set
  nome = excluded.nome,
  documento_fiscal = excluded.documento_fiscal,
  identidade = excluded.identidade,
  data_nascimento = excluded.data_nascimento,
  cidade_nascimento = excluded.cidade_nascimento,
  pais = excluded.pais,
  profissao = excluded.profissao,
  renda = excluded.renda,
  tipo_logradouro = excluded.tipo_logradouro,
  logradouro = excluded.logradouro,
  numero = excluded.numero,
  complemento = excluded.complemento,
  bairro = excluded.bairro,
  cidade = excluded.cidade,
  estado = excluded.estado,
  cep = excluded.cep,
  updated_at = now();

delete from pessoa_papeis where pessoa_id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

insert into pessoa_papeis (id, pessoa_id, papel) values
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'locador'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'proprietario'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'locatario'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'proprietario');

insert into imoveis (
  id, codigo, descricao_breve, descricao_detalhada, valor_aluguel, moeda,
  url_anuncio, bairro_localidade, numero_quartos, tipo_quarto,
  metros_quadrados_construidos, tipo_imovel, tipo_lavanderia,
  tipo_cozinha, area_gourmet_tipo, area_gourmet_metros_quadrados
) values
  (
    '44444444-4444-4444-4444-444444444444', 'IM001', 'Apartamento alto padrao mobiliado',
    'Unidade com varanda gourmet, cozinha americana e acabamento contemporaneo.',
    4200, 'BRL', 'https://exemplo.local/imovel/im001', 'Savassi', 3, 'casal suite',
    118, 'apartamento', 'anexa a cozinha', 'americana', 'na varanda', 16
  ),
  (
    '55555555-5555-5555-5555-555555555555', 'IM002', 'Casa duplex com area gourmet ampla',
    'Imovel com quintal, churrasqueira e configuracao ideal para familia.',
    6800, 'BRL', 'https://exemplo.local/imovel/im002', 'Castelo', 4, 'suite',
    240, 'casa duplex', 'ampla', 'comum', 'ampla com churrasqueira', 34
  )
on conflict (id) do update set
  descricao_breve = excluded.descricao_breve,
  descricao_detalhada = excluded.descricao_detalhada,
  valor_aluguel = excluded.valor_aluguel,
  moeda = excluded.moeda,
  url_anuncio = excluded.url_anuncio,
  bairro_localidade = excluded.bairro_localidade,
  numero_quartos = excluded.numero_quartos,
  tipo_quarto = excluded.tipo_quarto,
  metros_quadrados_construidos = excluded.metros_quadrados_construidos,
  tipo_imovel = excluded.tipo_imovel,
  tipo_lavanderia = excluded.tipo_lavanderia,
  tipo_cozinha = excluded.tipo_cozinha,
  area_gourmet_tipo = excluded.area_gourmet_tipo,
  area_gourmet_metros_quadrados = excluded.area_gourmet_metros_quadrados,
  updated_at = now();

delete from imovel_proprietarios where imovel_id in (
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

insert into imovel_proprietarios (id, imovel_id, pessoa_id, data_inicio, principal) values
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', current_date, 1),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', current_date, 1);

insert into alugueis (
  id, codigo, imovel_id, locador_id, locatario_id, data_inicio, data_fim,
  clausula_extensao_apos_prazo_original, valor_acordado_aluguel, indice_reajuste, percentual_reajuste
) values (
  '66666666-6666-6666-6666-666666666666', 'AL001', '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
  '2025-01-01', '2026-12-31',
  'Renovacao automatica mediante anuencia das partes e revisao contratual.',
  4200, 'IPCA', 6.5
)
on conflict (id) do update set
  imovel_id = excluded.imovel_id,
  locador_id = excluded.locador_id,
  locatario_id = excluded.locatario_id,
  data_inicio = excluded.data_inicio,
  data_fim = excluded.data_fim,
  clausula_extensao_apos_prazo_original = excluded.clausula_extensao_apos_prazo_original,
  valor_acordado_aluguel = excluded.valor_acordado_aluguel,
  indice_reajuste = excluded.indice_reajuste,
  percentual_reajuste = excluded.percentual_reajuste,
  updated_at = now();

delete from aluguel_periodos where aluguel_id = '66666666-6666-6666-6666-666666666666';

insert into aluguel_periodos (
  id, aluguel_id, periodo, data_inicio_periodo, data_fim_periodo,
  valor_acordado_aluguel, indice_reajuste, percentual_reajuste
) values
  (
    '77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 1,
    '2025-01-01', '2025-12-31', 4200, 'IPCA', 6.5
  ),
  (
    '88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', 2,
    '2026-01-01', '2026-12-31', 4473, 'IPCA', 6.5
  );
