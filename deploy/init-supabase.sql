create extension if not exists "pgcrypto";

create table if not exists pessoas (
  id uuid primary key,
  codigo varchar(30) not null unique,
  nome varchar(200) not null,
  documento_fiscal varchar(30) not null,
  identidade varchar(30) not null,
  data_nascimento date not null,
  cidade_nascimento varchar(120) not null,
  pais varchar(120) not null,
  profissao varchar(120) not null,
  renda numeric(15, 2) not null default 0,
  tipo_logradouro varchar(20) not null,
  logradouro varchar(200) not null,
  numero varchar(20) not null,
  complemento varchar(120),
  bairro varchar(120) not null,
  cidade varchar(120) not null,
  estado varchar(80) not null,
  cep varchar(20) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pessoa_papeis (
  id uuid primary key,
  pessoa_id uuid not null references pessoas(id) on delete cascade,
  papel varchar(20) not null,
  created_at timestamptz not null default now(),
  unique (pessoa_id, papel)
);

create table if not exists imoveis (
  id uuid primary key,
  codigo varchar(30) not null unique,
  descricao_breve varchar(255) not null,
  descricao_detalhada text not null,
  valor_aluguel numeric(15, 2) not null default 0,
  moeda varchar(10) not null,
  url_anuncio varchar(500),
  bairro_localidade varchar(120) not null,
  numero_quartos integer not null default 0,
  tipo_quarto varchar(30) not null,
  metros_quadrados_construidos numeric(10, 2) not null default 0,
  tipo_imovel varchar(40) not null,
  tipo_lavanderia varchar(40) not null,
  tipo_cozinha varchar(30) not null,
  area_gourmet_tipo varchar(50) not null,
  area_gourmet_metros_quadrados numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists imovel_proprietarios (
  id uuid primary key,
  imovel_id uuid not null references imoveis(id) on delete cascade,
  pessoa_id uuid not null references pessoas(id) on delete restrict,
  data_inicio date not null,
  data_fim date,
  principal smallint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alugueis (
  id uuid primary key,
  codigo varchar(30) not null unique,
  imovel_id uuid not null references imoveis(id) on delete restrict,
  locador_id uuid not null references pessoas(id) on delete restrict,
  locatario_id uuid not null references pessoas(id) on delete restrict,
  data_inicio date not null,
  data_fim date not null,
  clausula_extensao_apos_prazo_original text not null,
  valor_acordado_aluguel numeric(15, 2) not null default 0,
  indice_reajuste varchar(40) not null,
  percentual_reajuste numeric(7, 4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aluguel_periodos (
  id uuid primary key,
  aluguel_id uuid not null references alugueis(id) on delete cascade,
  periodo integer not null,
  data_inicio_periodo date not null,
  data_fim_periodo date not null,
  valor_acordado_aluguel numeric(15, 2) not null default 0,
  indice_reajuste varchar(40) not null,
  percentual_reajuste numeric(7, 4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aluguel_id, periodo)
);

create index if not exists idx_pessoas_nome on pessoas (nome);
create index if not exists idx_pessoa_papeis_pessoa on pessoa_papeis (pessoa_id);
create index if not exists idx_imovel_proprietarios_imovel on imovel_proprietarios (imovel_id);
create index if not exists idx_alugueis_imovel on alugueis (imovel_id);
create index if not exists idx_aluguel_periodos_aluguel on aluguel_periodos (aluguel_id);
