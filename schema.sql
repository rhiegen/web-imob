-- Schema inicial portavel para SQLite, PostgreSQL e Oracle
-- Observacao:
-- 1. Tipos podem precisar de pequenos ajustes por banco.
-- 2. O ideal e aplicar este desenho via migrations da camada de persistencia.

CREATE TABLE pessoas (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    documento_fiscal VARCHAR(30) NOT NULL,
    identidade VARCHAR(30) NOT NULL,
    data_nascimento DATE NOT NULL,
    cidade_nascimento VARCHAR(120) NOT NULL,
    pais VARCHAR(120) NOT NULL,
    profissao VARCHAR(120) NOT NULL,
    renda DECIMAL(15,2) NOT NULL,
    tipo_logradouro VARCHAR(20) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(120),
    bairro VARCHAR(120) NOT NULL,
    cidade VARCHAR(120) NOT NULL,
    estado VARCHAR(80) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE pessoa_papeis (
    id VARCHAR(36) PRIMARY KEY,
    pessoa_id VARCHAR(36) NOT NULL,
    papel VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_pessoa_papeis_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoas(id),
    CONSTRAINT uq_pessoa_papel UNIQUE (pessoa_id, papel)
);

CREATE TABLE imoveis (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descricao_breve VARCHAR(255) NOT NULL,
    descricao_detalhada TEXT,
    valor_aluguel DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(10) NOT NULL,
    url_anuncio VARCHAR(500),
    bairro_localidade VARCHAR(120) NOT NULL,
    numero_quartos INTEGER NOT NULL,
    tipo_quarto VARCHAR(30) NOT NULL,
    metros_quadrados_construidos DECIMAL(10,2) NOT NULL,
    tipo_imovel VARCHAR(40) NOT NULL,
    tipo_lavanderia VARCHAR(40) NOT NULL,
    tipo_cozinha VARCHAR(30) NOT NULL,
    area_gourmet_tipo VARCHAR(50) NOT NULL,
    area_gourmet_metros_quadrados DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE imovel_proprietarios (
    id VARCHAR(36) PRIMARY KEY,
    imovel_id VARCHAR(36) NOT NULL,
    pessoa_id VARCHAR(36) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    principal SMALLINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_imovel_proprietarios_imovel FOREIGN KEY (imovel_id) REFERENCES imoveis(id),
    CONSTRAINT fk_imovel_proprietarios_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoas(id)
);

CREATE TABLE alugueis (
    id VARCHAR(36) PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    imovel_id VARCHAR(36) NOT NULL,
    locador_id VARCHAR(36) NOT NULL,
    locatario_id VARCHAR(36) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    clausula_extensao_apos_prazo_original TEXT,
    valor_acordado_aluguel DECIMAL(15,2) NOT NULL,
    indice_reajuste VARCHAR(40) NOT NULL,
    percentual_reajuste DECIMAL(7,4) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_alugueis_imovel FOREIGN KEY (imovel_id) REFERENCES imoveis(id),
    CONSTRAINT fk_alugueis_locador FOREIGN KEY (locador_id) REFERENCES pessoas(id),
    CONSTRAINT fk_alugueis_locatario FOREIGN KEY (locatario_id) REFERENCES pessoas(id)
);

CREATE TABLE aluguel_periodos (
    id VARCHAR(36) PRIMARY KEY,
    aluguel_id VARCHAR(36) NOT NULL,
    periodo INTEGER NOT NULL,
    data_inicio_periodo DATE NOT NULL,
    data_fim_periodo DATE NOT NULL,
    valor_acordado_aluguel DECIMAL(15,2) NOT NULL,
    indice_reajuste VARCHAR(40) NOT NULL,
    percentual_reajuste DECIMAL(7,4) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_aluguel_periodos_aluguel FOREIGN KEY (aluguel_id) REFERENCES alugueis(id),
    CONSTRAINT uq_aluguel_periodo UNIQUE (aluguel_id, periodo)
);

CREATE INDEX idx_pessoas_nome ON pessoas (nome);
CREATE INDEX idx_pessoas_documento_fiscal ON pessoas (documento_fiscal);
CREATE INDEX idx_pessoa_papeis_papel ON pessoa_papeis (papel);
CREATE INDEX idx_imoveis_bairro_localidade ON imoveis (bairro_localidade);
CREATE INDEX idx_imovel_proprietarios_imovel ON imovel_proprietarios (imovel_id);
CREATE INDEX idx_imovel_proprietarios_pessoa ON imovel_proprietarios (pessoa_id);
CREATE INDEX idx_alugueis_imovel ON alugueis (imovel_id);
CREATE INDEX idx_alugueis_locador ON alugueis (locador_id);
CREATE INDEX idx_alugueis_locatario ON alugueis (locatario_id);
CREATE INDEX idx_aluguel_periodos_aluguel ON aluguel_periodos (aluguel_id);

-- Validacoes de dominio que devem existir tambem na aplicacao:
-- tipo_logradouro: Rua, Praca, Avenida, Quadra
-- tipo_quarto: suite, solteiro, casal, casal suite
-- tipo_imovel: casa terrea, casa geminada, apartamento, casa duplex,
--              apartamento duplex, apartamento triplex, cobertura, casa tipo sobrado
-- tipo_lavanderia: ampla, anexa a cozinha
-- tipo_cozinha: americana, comum
-- area_gourmet_tipo: simples, na varanda, ampla com churrasqueira
-- papel: locador, locatario, proprietario
