# Estrutura Inicial do Projeto

## Modelo Recomendado
Monorepo simples com separacao entre frontend, backend e contratos compartilhados.

```text
web/
  apps/
    web/
      src/
        app/
        pages/
        features/
          pessoas/
          imoveis/
          alugueis/
        components/
        services/
          api/
        schemas/
        styles/
        routes/
        hooks/
        utils/
    api/
      src/
        app/
        modules/
          pessoas/
            controllers/
            services/
            repositories/
            dto/
          imoveis/
            controllers/
            services/
            repositories/
            dto/
          alugueis/
            controllers/
            services/
            repositories/
            dto/
          aluguel-periodos/
            controllers/
            services/
            repositories/
            dto/
        core/
          database/
          contracts/
        infra/
          http/
          persistence/
            sqlite/
            postgres/
            oracle/
        shared/
          errors/
          types/
          utils/
  packages/
    shared/
      src/
        enums/
        schemas/
        dto/
        types/
  docs/
    web.md
    backlog.md
    project-structure.md
    schema.sql
```

## Responsabilidades

### `apps/web`
- interface React
- rotas
- telas e formularios
- componentes reutilizaveis
- comunicacao com API

### `apps/api`
- regras de negocio
- endpoints REST
- camada de persistencia
- adaptacao para SQLite, PostgreSQL e Oracle

### `packages/shared`
- enums do dominio
- schemas Zod
- DTOs compartilhados
- tipos reutilizaveis

## Principios Estruturais
- organizar por modulo de negocio antes de organizar por tipo tecnico
- manter contratos compartilhados em pacote proprio
- impedir vazamento de detalhes do banco para o dominio
- evitar criar componentes genericos sem uso real
- reutilizar formularios de pessoa para locador, locatario e proprietario

## Componentes de UI Reutilizaveis Sugeridos
- `DataTable`
- `PageHeader`
- `SearchFilters`
- `FormSection`
- `CurrencyInput`
- `DateInput`
- `SelectField`
- `ConfirmDialog`
- `EntityStatusMessage`

## Servicos de Backend Reutilizaveis Sugeridos
- `DatabaseProvider`
- `TransactionManager`
- `CodeGeneratorService`
- `AuditTimestampService`
- `ValidationErrorMapper`

## Observacao Sobre Banco
- `sqlite` para desenvolvimento local ou deploy simples
- `postgres` para producao com escalabilidade horizontal
- `oracle` para contexto corporativo ou integracao exigida
