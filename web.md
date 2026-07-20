# Plano do Sistema Web Imobiliario

## Objetivo
Construir um sistema web profissional, direto e de uso administrativo para gerenciamento de:
- locadores
- locatarios
- imoveis
- alugueis
- periodos anuais de locacao

O sistema deve usar React + TypeScript no frontend, persistencia inicialmente em SQLite, com arquitetura preparada para operar tambem com PostgreSQL ou Oracle sem duplicar regras de negocio.

## Diretrizes de Implementacao
- Interface web profissional e objetiva
- Interface com tema dark como padrao visual
- Garantir alto contraste entre texto, acoes e planos de fundo
- Garantir acessibilidade para pessoas com deficiencia visual ou cegueira
- Incluir controle visivel para ajuste de tamanho da fonte na interface
- Incluir controle visivel para traducao do texto exibido no site
- Reutilizar componentes, formularios e regras de validacao sempre que fizer sentido
- Evitar duplicar cadastro de pessoas quando locador e locatario possuem os mesmos campos
- Manter o codigo simples, direto e alinhado a padroes de projeto apenas quando eles agregarem clareza real
- Aplicar padroes de projeto apenas quando resolverem um problema real do dominio
- Seguir as tecnicas do `ponytail` anexado ao ambiente, caso esse material esteja disponivel no momento da implementacao

Observacao: nao foram encontradas referencias locais a `ponytail` no workspace atual durante esta etapa de planejamento. O plano abaixo considera essa diretriz como requisito arquitetural de implementacao.

## Stack Recomendada
- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- API: REST
- Banco de dados: SQLite no inicio, com suporte planejado para PostgreSQL e Oracle
- ORM ou camada SQL: preferencia por uma camada de repositorio desacoplada do banco; se o Oracle for obrigatorio desde o inicio, priorizar query builder ou acesso SQL mais controlado em vez de acoplamento excessivo ao ORM
- Validacao: Zod
- Estilo: componentes reutilizaveis com design limpo e foco administrativo

## Estrategia de Banco de Dados

### Banco inicial e portabilidade
- usar SQLite para ambiente local, desenvolvimento rapido e implantacoes simples
- preparar a aplicacao para trocar o banco por configuracao
- evitar recursos muito especificos de um unico banco no dominio principal
- manter regras de negocio acima da camada de persistencia

### Bancos previstos
- `SQLite`: melhor para fase inicial, uso local e baixo volume concorrente
- `PostgreSQL`: melhor opcao para producao com maior concorrencia, relatorios e escalabilidade
- `Oracle`: opcao corporativa quando houver exigencia institucional ou integracao com ambiente legado

### Abordagem recomendada
- definir interfaces de repositorio por agregado de negocio
- concentrar SQL, mapeamentos e peculiaridades de banco dentro da camada de infraestrutura
- usar migrations versionadas
- padronizar tipos comuns entre bancos: texto, numerico, data, booleano logico
- evitar dependencia de auto incrementos e defaults muito especificos sem encapsulamento

### Decisao arquitetural
- o dominio nao deve saber se esta em SQLite, PostgreSQL ou Oracle
- a selecao do banco deve ocorrer por configuracao de ambiente
- a aplicacao deve iniciar com um `DatabaseProvider` ou `PersistenceAdapter`

## Balanceamento de Carga

### Premissa importante
SQLite nao e adequado para arquitetura com varias instancias gravando concorrentemente atras de balanceador, exceto em cenarios muito controlados.

### Estrategia por banco
- `SQLite`: preferir instancia unica da aplicacao ou uso local sem balanceamento horizontal de escrita
- `PostgreSQL`: permitir multiplas instancias da API atras de load balancer
- `Oracle`: permitir multiplas instancias da API atras de load balancer, conforme capacidade e licenciamento do ambiente

### Arquitetura recomendada para escalabilidade
- frontend servido separadamente
- backend stateless
- sessoes sem estado no servidor ou token-based
- upload e arquivos externos desacoplados do filesystem local
- cache opcional em camada externa se o sistema crescer

### Topologia recomendada
1. frontend React
2. API Node.js stateless
3. load balancer reverso na frente da API
4. banco de dados centralizado

### Quando usar cada modo
- modo simples: React + API unica + SQLite
- modo intermediario: React + API unica + PostgreSQL
- modo escalavel: React + varias instancias da API + PostgreSQL ou Oracle + load balancer

## Melhor Pratica de Modelagem
Em vez de criar cadastros separados e duplicados para locador e locatario, a melhor pratica e ter uma entidade unica de `Pessoa`, com papeis de negocio.

### Entidade unica de pessoas
Uma mesma pessoa pode ser:
- locador
- locatario
- proprietario

Isso evita:
- duplicacao de campos
- divergencia de dados
- retrabalho em manutencao
- repeticao de formularios e validacoes

## Modulos do Sistema
1. Cadastro de pessoas
2. Cadastro de imoveis
3. Cadastro de alugueis
4. Controle de periodos anuais do aluguel
5. Consulta e manutencao de registros

## Modelagem Conceitual

### 1. Pessoas
Tabela sugerida: `pessoas`

Campos:
- `id`
- `codigo`
- `nome`
- `documentoFiscal`
- `identidade`
- `dataNascimento`
- `cidadeNascimento`
- `pais`
- `profissao`
- `renda`
- `tipoLogradouro` com lista: `Rua`, `Praca`, `Avenida`, `Quadra`
- `logradouro`
- `numero`
- `complemento`
- `bairro`
- `cidade`
- `estado`
- `cep`
- `createdAt`
- `updatedAt`

Tabela complementar sugerida: `pessoa_papeis`

Campos:
- `id`
- `pessoaId`
- `papel` com valores: `locador`, `locatario`, `proprietario`

Motivo:
- uma pessoa pode assumir mais de um papel
- evita criar duas tabelas iguais para locador e locatario

### 2. Imoveis
Tabela sugerida: `imoveis`

Campos:
- `id`
- `codigo`
- `descricaoBreve`
- `descricaoDetalhada`
- `valorAluguel`
- `moeda`
- `urlAnuncio`
- `bairroLocalidade`
- `numeroQuartos`
- `tipoQuarto` com lista: `suite`, `solteiro`, `casal`, `casal suite`
- `metrosQuadradosConstruidos`
- `tipoImovel` com lista:
  - `casa terrea`
  - `casa geminada`
  - `apartamento`
  - `casa duplex`
  - `apartamento duplex`
  - `apartamento triplex`
  - `cobertura`
  - `casa tipo sobrado`
- `tipoLavanderia` com lista: `ampla`, `anexa a cozinha`
- `tipoCozinha` com lista: `americana`, `comum`
- `areaGourmetTipo` com lista: `simples`, `na varanda`, `ampla com churrasqueira`
- `areaGourmetMetrosQuadrados`
- `createdAt`
- `updatedAt`

### 3. Relacao entre imovel e proprietario
Melhor pratica: usar tabela de relacionamento, nao gravar o proprietario diretamente na tabela de imoveis.

Tabela sugerida: `imovel_proprietarios`

Campos:
- `id`
- `imovelId`
- `pessoaId`
- `dataInicio`
- `dataFim`
- `principal`

Motivos:
- permite historico de proprietarios
- suporta multiplos proprietarios se necessario
- evita acoplamento indevido no cadastro do imovel

### 4. Alugueis
Tabela sugerida: `alugueis`

Campos:
- `id`
- `codigo`
- `imovelId`
- `locadorId`
- `locatarioId`
- `dataInicio`
- `dataFim`
- `clausulaExtensaoAposPrazoOriginal`
- `valorAcordadoAluguel`
- `indiceReajuste`
- `percentualReajuste`
- `createdAt`
- `updatedAt`

Observacao:
- `locadorId` e `locatarioId` referenciam a tabela `pessoas`
- o `imovelId` referencia a tabela `imoveis`

### 5. Periodos anuais da locacao
Tabela sugerida: `aluguel_periodos`

Campos:
- `id`
- `aluguelId`
- `periodo` inteiro
- `dataInicioPeriodo`
- `dataFimPeriodo`
- `valorAcordadoAluguel`
- `indiceReajuste`
- `percentualReajuste`
- `createdAt`
- `updatedAt`

Regra de negocio:
- cada aluguel pode ter varios periodos
- o primeiro ano deve receber `periodo = 1`
- o segundo ano deve receber `periodo = 2`
- e assim sucessivamente

Motivo:
- facilita historico de reajustes
- permite registrar renovacoes e extensoes sem perder rastreabilidade

## Relacionamentos Principais
- uma `pessoa` pode ter varios `papeis`
- uma `pessoa` pode ser proprietaria de varios `imoveis`
- um `imovel` pode ter um ou mais proprietarios ao longo do tempo
- um `aluguel` vincula um `imovel`, um `locador` e um `locatario`
- um `aluguel` possui varios `periodos`

## Funcionalidades do Sistema

### Cadastro de Pessoas
- criar pessoa
- editar pessoa
- excluir pessoa
- listar pessoas
- filtrar por nome, documento e papel
- marcar se a pessoa atua como locador, locatario e ou proprietario

### Cadastro de Imoveis
- criar imovel
- editar imovel
- excluir imovel
- listar imoveis
- vincular proprietario ao imovel
- visualizar detalhes do imovel

### Cadastro de Alugueis
- criar contrato de aluguel
- vincular imovel, locador e locatario
- informar datas do contrato
- informar clausula de extensao
- informar valor acordado, indice e percentual de reajuste
- gerar ou registrar periodos anuais

### Controle de Periodos
- listar periodos de um aluguel
- criar novo periodo anual
- editar periodo
- registrar reajustes por periodo

## Regras de Validacao

### Pessoas
- `nome` obrigatorio
- `documentoFiscal` obrigatorio
- `identidade` obrigatoria
- `dataNascimento` obrigatoria
- `cidadeNascimento` obrigatoria
- `pais` obrigatorio
- `profissao` obrigatoria
- `renda` obrigatoria e maior ou igual a zero
- `tipoLogradouro` obrigatorio e limitado aos valores definidos
- `logradouro` obrigatorio
- `numero` obrigatorio
- `bairro` obrigatorio
- `cidade` obrigatoria
- `estado` obrigatorio
- `cep` obrigatorio

### Imoveis
- `descricaoBreve` obrigatoria
- `valorAluguel` obrigatorio e maior ou igual a zero
- `moeda` obrigatoria
- `bairroLocalidade` obrigatorio
- `numeroQuartos` obrigatorio e inteiro
- `tipoQuarto` obrigatorio
- `metrosQuadradosConstruidos` obrigatorio e maior que zero
- `tipoImovel` obrigatorio
- `tipoLavanderia` obrigatorio
- `tipoCozinha` obrigatorio
- `areaGourmetTipo` obrigatorio
- `areaGourmetMetrosQuadrados` obrigatorio quando houver area gourmet mensuravel

### Alugueis
- `imovelId` obrigatorio
- `locadorId` obrigatorio
- `locatarioId` obrigatorio
- `dataInicio` obrigatoria
- `dataFim` obrigatoria
- `dataFim` deve ser posterior a `dataInicio`
- `valorAcordadoAluguel` obrigatorio e maior ou igual a zero
- `indiceReajuste` obrigatorio
- `percentualReajuste` obrigatorio e maior ou igual a zero

### Periodos
- `periodo` obrigatorio e sequencial por aluguel
- `dataInicioPeriodo` obrigatoria
- `dataFimPeriodo` obrigatoria
- nao pode haver sobreposicao de periodos do mesmo aluguel

## Interface Web

### Caracteristicas desejadas
- visual profissional
- tema dark consistente
- alto contraste
- navegacao direta
- foco em produtividade administrativa
- formularios claros e objetivos
- listagens com busca e acoes rapidas
- suporte adequado a leitores de tela
- navegacao completa por teclado
- textos, rotulos e estados anunciaveis por tecnologias assistivas
- controle de tamanho de fonte acessivel por icone
- controle de idioma acessivel por icone

### Acessibilidade
- seguir WCAG como referencia de implementacao
- garantir contraste adequado em textos, icones, bordas e estados de foco
- usar estrutura semantica correta de titulos, tabelas, formularios e botoes
- garantir labels explicitos em todos os campos
- fornecer feedback de erro textual e nao apenas visual
- manter ordem logica de tabulacao
- garantir foco visivel em todos os elementos interativos
- evitar depender apenas de cor para comunicar estado
- validar uso com leitor de tela durante a implementacao
- permitir aumento e reducao de fonte sem quebra de layout critico
- garantir que icones de acessibilidade tenham rotulos textuais para leitores de tela

### Internacionalizacao
- prever arquitetura de i18n desde o inicio
- separar textos da interface em arquivos de traducao
- suportar pelo menos os idiomas:
  - portugues
  - ingles
  - espanhol paraguaio
  - guarani
  - alemao
- permitir troca de idioma por controle visivel na interface
- evitar textos fixos diretamente em componentes
- permitir expansao futura para novos idiomas sem refatoracao estrutural

### Telas principais
1. Dashboard inicial
2. Lista de pessoas
3. Formulario de pessoa
4. Lista de imoveis
5. Formulario de imovel
6. Tela de detalhe do imovel
7. Lista de alugueis
8. Formulario de aluguel
9. Tela de periodos do aluguel

### Padrao de UI recomendado
- layout com menu lateral simples
- cabecalho com contexto da pagina
- tabelas com filtros no topo
- acoes primarias destacadas
- modais apenas para acoes curtas
- formularios longos em paginas dedicadas
- estados de foco bem visiveis no tema dark
- combinacoes de cores com contraste elevado
- icone persistente para ajuste de fonte no cabecalho ou barra de acessibilidade
- icone persistente para troca de idioma no cabecalho

## Estrutura Tecnica Recomendada

### Frontend
- `pages` para telas principais
- `components` para blocos reutilizaveis
- `features` por modulo: pessoas, imoveis, alugueis
- `services` para acesso a API
- `schemas` para validacoes compartilhadas
- `i18n` para arquivos de traducao e configuracao de idioma

### Backend
- `modules/pessoas`
- `modules/imoveis`
- `modules/alugueis`
- `modules/aluguel-periodos`
- `core/database`
- `infra/persistence/sqlite`
- `infra/persistence/postgres`
- `infra/persistence/oracle`
- `repositories` para acesso a dados
- `services` para regras de negocio
- `controllers` para camada HTTP

### Estrutura inicial sugerida do projeto

#### Frontend
- `src/app`
- `src/pages`
- `src/features/pessoas`
- `src/i18n`
- `src/components/accessibility`
- `src/components/language`
- `src/features/imoveis`
- `src/features/alugueis`
- `src/components`
- `src/services/api`
- `src/schemas`
- `src/styles`

#### Backend
- `src/app`
- `src/modules/pessoas`
- `src/modules/imoveis`
- `src/modules/alugueis`
- `src/modules/aluguel-periodos`
- `src/core/database`
- `src/core/contracts`
- `src/infra/http`
- `src/infra/persistence/sqlite`
- `src/infra/persistence/postgres`
- `src/infra/persistence/oracle`
- `src/shared`

## Padroes de Projeto Adequados
- Repository para isolamento do acesso ao banco
- Service para regras de negocio e validacoes de dominio
- DTOs para entrada e saida da API
- Schema validation para contratos de dados
- Componentizacao no frontend para reduzir duplicacao
- Adapter ou Provider para selecionar o banco por ambiente
- Composition Root para montar dependencias de persistencia sem espalhar condicionais no dominio
- Provider de idioma e contexto de acessibilidade para fonte e preferencias visuais

Evitar:
- abstrair cedo demais
- criar helpers genericos sem uso concreto
- duplicar formulario de locador e locatario quando ambos podem reutilizar o modulo de pessoas

## Endpoints Planejados

### Pessoas
- `GET /pessoas`
- `GET /pessoas/:id`
- `POST /pessoas`
- `PUT /pessoas/:id`
- `DELETE /pessoas/:id`

### Imoveis
- `GET /imoveis`
- `GET /imoveis/:id`
- `POST /imoveis`
- `PUT /imoveis/:id`
- `DELETE /imoveis/:id`

### Proprietarios do Imovel
- `POST /imoveis/:id/proprietarios`
- `PUT /imoveis/:id/proprietarios/:relacaoId`
- `DELETE /imoveis/:id/proprietarios/:relacaoId`

### Alugueis
- `GET /alugueis`
- `GET /alugueis/:id`
- `POST /alugueis`
- `PUT /alugueis/:id`
- `DELETE /alugueis/:id`

### Periodos do Aluguel
- `GET /alugueis/:id/periodos`
- `POST /alugueis/:id/periodos`
- `PUT /alugueis/:id/periodos/:periodoId`
- `DELETE /alugueis/:id/periodos/:periodoId`

## Sequencia de Implementacao
1. Definir a modelagem final das entidades e relacionamentos
2. Definir o contrato da camada de persistencia para suportar SQLite, PostgreSQL e Oracle
3. Criar o schema inicial e migrations portaveis
4. Implementar o modulo de pessoas com papeis
5. Implementar o modulo de imoveis
6. Implementar a relacao entre imovel e proprietario
7. Implementar o modulo de alugueis
8. Implementar o modulo de periodos anuais do aluguel
9. Criar validacoes compartilhadas com schemas tipados
10. Construir a interface web por modulo
11. Reutilizar componentes de formulario, tabela e filtros
12. Testar o fluxo completo de cadastro e vinculacoes
13. Validar compatibilidade entre SQLite e PostgreSQL
14. Planejar adaptacao Oracle com testes de integracao especificos
15. Ajustar refinamentos visuais e consistencia de UX

## Entregavel 1: Modelagem SQL e ORM

### Modelagem logica recomendada
- `pessoas`
- `pessoa_papeis`
- `imoveis`
- `imovel_proprietarios`
- `alugueis`
- `aluguel_periodos`

### Regras para SQL portavel
- usar chaves primarias tecnicas em todas as tabelas
- usar `codigo` de negocio unico onde for necessario expor identificadores humanos
- normalizar listas fechadas como enums na aplicacao e, se necessario, tabelas de dominio no banco
- manter nomes de colunas consistentes e sem dependencia de convencoes exclusivas de um banco
- definir indices para chaves estrangeiras e buscas frequentes

### Recomendacao de persistencia
- comecar com repositorios e schemas tipados
- gerar implementacao SQLite primeiro
- manter contratos identicos para PostgreSQL e Oracle
- introduzir testes de repositorio compartilhados para validar comportamento igual entre bancos

## Implementacao Real Atual

### Estado atual da implementacao
- frontend real em React + TypeScript consumindo API
- backend real em Node.js + Express + PostgreSQL
- validacao compartilhada com Zod
- CRUD real de pessoas, imoveis e alugueis
- CRUD real de periodos anuais dentro do fluxo de aluguel
- tema dark, alto contraste, traducao e controle de tamanho de fonte ativos no frontend

### Simplicidade e padroes aplicados
- manter a implementacao simples e orientada ao dominio atual
- usar schema validation para entrada e saida de dados
- usar transacoes no backend apenas onde ha escrita em mais de uma tabela relacionada
- evitar camadas extras sem necessidade concreta nesta fase
- preferir funcoes pequenas e fluxo direto sobre abstrações prematuras

### Arquivos e scripts de implementacao real
- `apps/api/src/server.ts`: API real com CRUD e persistencia PostgreSQL
- `apps/web/src/App.tsx`: interface real com formularios e listagens
- `packages/shared/src/index.ts`: tipos e schemas compartilhados
- `Dockerfile`: imagem de producao para VPS
- `.dockerignore`: contexto enxuto para build da imagem
- `docker-compose.vps.yml`: subida simplificada da aplicacao em container na VPS
- `docker-compose.vps.full.yml`: subida conjunta da aplicacao com Nginx
- `.env.vps.example`: modelo de ambiente para VPS
- `deploy/init-supabase.sql`: criacao completa do banco e tabelas
- `deploy/init-supabase.sh`: aplicacao automatica do schema no Supabase
- `deploy/seed.sql`: carga de dados iniciais reais de exemplo
- `deploy/seed.sh`: aplicacao automatica do seed
- `deploy/DEPLOY-VPS.md`: guia curto de implantacao em VPS
- `deploy/nginx.conf`: proxy reverso com Nginx para expor a aplicacao
- `deploy/PRODUCTION-CHECKLIST.md`: checklist final de publicacao em producao
- `deploy/install-vps.sh`: instalacao da aplicacao na VPS
- `deploy/setup-vps.sh`: comando unico para banco + instalacao na VPS
- `run-local.sh`: execucao local da aplicacao

## Implantacao em VPS

### Premissas de instalacao
- VPS Linux com Node.js 20+
- npm instalado
- cliente `psql` instalado para aplicar o schema do Supabase
- acesso ao banco PostgreSQL do Supabase via `DATABASE_URL` ou `SUPABASE_DB_URL`

### Equivalente local para desenvolvimento
- quando Supabase local nao estiver disponivel, usar PostgreSQL local em Docker como equivalente comunitario e pragmatico
- arquivo de composicao local: `docker-compose.local.yml`
- container esperado: `imob-postgres`
- o daemon do Docker precisa estar ativo antes de subir o banco local

### Script principal de instalacao
- arquivo: `deploy/install-vps.sh`
- objetivo: copiar o projeto para a VPS, instalar dependencias, gerar build e registrar servico `systemd`

### Primeira rodada de instalacao
- a primeira instalacao deve criar automaticamente o banco, as tabelas e os relacionamentos antes de subir a aplicacao
- a primeira instalacao deve criar automaticamente os secrets da aplicacao na VPS caso eles ainda nao existam
- o fluxo recomendado deve executar o schema inicial e, opcionalmente, a carga inicial de dados
- o comando unico para esta primeira rodada e `bash ./deploy/setup-vps.sh`
- esse comando depende de `.env` corretamente configurado com `DATABASE_URL`

### Secrets na VPS
- os secrets devem ser gerados automaticamente na primeira rodada de instalacao
- arquivo responsavel: `deploy/generate-secrets.sh`
- secrets previstos:
  - `APP_SECRET`
  - `SESSION_SECRET`
- a geracao deve ocorrer apenas quando o secret ainda nao existir no arquivo `.env`
- o procedimento deve evitar sobrescrever valores ja definidos manualmente

### Fluxo de instalacao recomendado
1. copiar o projeto para a VPS
2. configurar variaveis no arquivo `.env`
3. executar `deploy/generate-secrets.sh` para garantir os secrets da aplicacao
4. executar `deploy/init-supabase.sh` para criar o banco e as tabelas
5. executar `deploy/seed.sh` se desejar dados iniciais
6. executar `deploy/install-vps.sh`
7. ou usar `deploy/setup-vps.sh` como comando unico
8. iniciar o servico `imob-admin.service`
9. validar a aplicacao via endpoint `/health`

### Fluxo empacotado para deploy
1. descompactar o arquivo `.zip` do projeto na VPS
2. copiar `.env.vps.example` para `.env` e ajustar `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`
3. executar `npm install`
4. executar `bash ./deploy/setup-vps.sh`
5. confirmar que os secrets foram gravados no `.env`
6. iniciar o servico com `sudo systemctl start imob-admin.service`
7. validar `sudo systemctl status imob-admin.service` e `GET /health`

### Alternativa com Docker na VPS
1. copiar `.env.vps.example` para `.env`
2. ajustar `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`
3. executar `bash ./deploy/init-supabase.sh`
4. executar `docker build -t web-imob-admin .`
5. executar `docker run -d --name web-imob-admin --restart always -p 3001:3001 --env-file .env web-imob-admin`
6. validar `GET /health`

### Alternativa com Docker Compose na VPS
1. copiar `.env.vps.example` para `.env`
2. ajustar `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`
3. executar `bash ./deploy/init-supabase.sh`
4. executar `docker compose -f docker-compose.vps.yml up -d --build`
5. validar `GET /health`

### Alternativa com Docker Compose completo + Nginx
1. copiar `.env.vps.example` para `.env`
2. ajustar `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`
3. executar `bash ./deploy/init-supabase.sh`
4. executar `docker compose -f docker-compose.vps.full.yml up -d --build`
5. validar acesso HTTP na porta 80
6. usar `deploy/PRODUCTION-CHECKLIST.md` para a publicacao final

### Deploy automatizado por GitHub Actions
- workflow previsto: `.github/workflows/deploy-vps.yml`
- disparo manual via `workflow_dispatch`
- o workflow deve:
  - gerar o build
  - empacotar o projeto
  - enviar o arquivo para a VPS por SSH
  - descompactar no destino
  - executar `deploy/setup-vps.sh`
  - reiniciar `imob-admin.service`
- secrets esperados no GitHub:
  - `VPS_HOST`
  - `VPS_USER`
  - `VPS_SSH_KEY`
  - `VPS_DEPLOY_PATH`

## Banco Supabase

### Script de criacao completa do banco
- arquivo SQL: `deploy/init-supabase.sql`
- script shell: `deploy/init-supabase.sh`

### Tabelas criadas no Supabase
- `pessoas`
- `pessoa_papeis`
- `imoveis`
- `imovel_proprietarios`
- `alugueis`
- `aluguel_periodos`

### Como aplicar o schema
1. exportar `SUPABASE_DB_URL` ou `DATABASE_URL`
2. executar `bash ./deploy/init-supabase.sh`
3. validar a criacao das tabelas no painel ou via `psql`

### Como aplicar dados iniciais
1. garantir que o schema ja foi criado
2. executar `bash ./deploy/seed.sh`
3. validar os registros iniciais em `pessoas`, `imoveis` e `alugueis`

### Fluxo local equivalente
1. iniciar Docker
2. executar `docker compose -f docker-compose.local.yml up -d`
3. configurar `.env` com a `DATABASE_URL` local
4. executar `bash ./deploy/init-supabase.sh`
5. executar `bash ./deploy/seed.sh`
6. executar `./run-local.sh`

## Entregavel 2: Estrutura Inicial do Projeto

### Monorepo simples recomendado
- `apps/web` para frontend React
- `apps/api` para backend Node.js
- `packages/shared` para tipos, schemas e contratos compartilhados

### Responsabilidades
- `apps/web`: interface, rotas, formularios, listagens e integracao com API
- `apps/api`: dominio, regras de negocio, persistencia e endpoints REST
- `packages/shared`: tipos de DTO, enums, validadores e helpers de dominio realmente compartilhados

### Vantagens dessa estrutura
- reduz duplicacao entre frontend e backend
- facilita evolucao para multiplos bancos
- organiza melhor testes e contratos

## Entregavel 3: Backlog Tecnico por Fases

### Fase 1: Fundacao
- definir entidades e relacionamentos finais
- configurar monorepo ou estrutura de apps separadas
- configurar TypeScript, lint e padrao de pastas
- criar adaptador de banco e configuracao por ambiente
- subir schema inicial em SQLite
- registrar no planejamento os scripts de instalacao e inicializacao do banco

### Fase 2: Pessoas
- implementar tabela `pessoas`
- implementar tabela `pessoa_papeis`
- criar CRUD de pessoas
- criar filtros por nome, documento e papel
- reutilizar formulario unico para locador, locatario e proprietario

### Fase 3: Imoveis
- implementar tabela `imoveis`
- criar CRUD de imoveis
- criar relacao `imovel_proprietarios`
- permitir historico de proprietarios

### Fase 4: Alugueis
- implementar tabela `alugueis`
- vincular imovel, locador e locatario
- validar vigencia e integridade dos dados
- criar CRUD de alugueis

### Fase 5: Periodos anuais
- implementar tabela `aluguel_periodos`
- criar rotina de criacao e manutencao de periodos
- validar sequencia numerica e ausencia de sobreposicao
- registrar reajustes anuais

### Fase 6: Interface profissional
- criar layout administrativo
- aplicar tema dark desde a base do design system
- definir paleta com contraste alto
- criar listagens com filtros e acoes rapidas
- criar formularios dedicados por modulo
- padronizar feedback visual, erros e confirmacoes
- validar navegacao por teclado
- validar semantica e leitura por tecnologias assistivas
- implementar controle por icone para aumento e reducao de fonte
- implementar controle por icone para traducao da interface
- criar arquivos de traducao para portugues, ingles, espanhol paraguaio, guarani e alemao

### Fase 7: Escalabilidade e banco corporativo
- validar adaptacao para PostgreSQL
- testar concorrencia real em ambiente multiusuario
- planejar implementacao Oracle se exigido
- preparar deploy com load balancer para API stateless
- preparar instalacao inicial em VPS com `systemd`
- preparar script de criacao completa do banco no Supabase

## Ordem Recomendada de Entrega
1. Pessoas
2. Imoveis
3. Relacao de proprietarios
4. Alugueis
5. Periodos anuais
6. Filtros, busca e refinamentos de interface

## Riscos de Projeto que Devem Ser Evitados
- criar tabelas duplicadas para locador e locatario
- acoplar proprietario diretamente no cadastro do imovel sem historico
- guardar reajustes apenas no contrato principal e perder o historico anual
- criar componentes de UI repetidos para cada modulo
- misturar regras de negocio com logica de interface

## Resultado Esperado
Ao final, o sistema deve permitir cadastrar e manter pessoas, imoveis e alugueis com rastreabilidade, boa modelagem de dados, interface direta e base tecnica limpa para evolucao futura.
