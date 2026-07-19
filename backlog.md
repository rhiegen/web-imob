# Backlog Tecnico

## Fase 1: Fundacao
- [ ] Definir stack final de frontend e backend
- [ ] Definir estrategia de persistencia para SQLite, PostgreSQL e Oracle
- [ ] Criar estrutura monorepo com `apps/web`, `apps/api` e `packages/shared`
- [ ] Configurar TypeScript em todos os pacotes
- [ ] Configurar lint e padroes de codigo
- [ ] Configurar variaveis de ambiente por banco
- [ ] Criar `DatabaseProvider` para selecao do banco por ambiente
- [ ] Criar migrations iniciais do schema

## Fase 2: Dominio Compartilhado
- [ ] Criar enums de dominio para logradouro, tipo de quarto, tipo de imovel, cozinha e lavanderia
- [ ] Criar DTOs compartilhados
- [ ] Criar schemas Zod compartilhados
- [ ] Definir regras de validacao de negocio comuns

## Fase 3: Modulo de Pessoas
- [ ] Criar entidade `pessoas`
- [ ] Criar entidade `pessoa_papeis`
- [ ] Implementar repositorios de pessoas
- [ ] Implementar servicos de cadastro, edicao, exclusao e consulta
- [ ] Implementar endpoints REST de pessoas
- [ ] Criar formulario unico de pessoa
- [ ] Criar listagem com filtro por nome, documento e papel

## Fase 4: Modulo de Imoveis
- [ ] Criar entidade `imoveis`
- [ ] Implementar repositorios de imoveis
- [ ] Implementar servicos de cadastro, edicao, exclusao e consulta
- [ ] Implementar endpoints REST de imoveis
- [ ] Criar formulario de imovel
- [ ] Criar listagem e pagina de detalhe do imovel

## Fase 5: Proprietarios de Imovel
- [ ] Criar entidade `imovel_proprietarios`
- [ ] Implementar servico de vinculacao de proprietario ao imovel
- [ ] Implementar controle de historico de proprietarios
- [ ] Criar endpoints de vinculacao e remocao
- [ ] Exibir proprietarios na tela de detalhe do imovel

## Fase 6: Modulo de Alugueis
- [ ] Criar entidade `alugueis`
- [ ] Implementar repositorios de alugueis
- [ ] Implementar servicos de cadastro, edicao, exclusao e consulta
- [ ] Validar consistencia entre imovel, locador e locatario
- [ ] Implementar endpoints REST de alugueis
- [ ] Criar formulario de aluguel
- [ ] Criar listagem de alugueis

## Fase 7: Periodos Anuais
- [ ] Criar entidade `aluguel_periodos`
- [ ] Implementar regra de `periodo` sequencial
- [ ] Implementar validacao contra sobreposicao de periodos
- [ ] Implementar cadastro e edicao de periodos
- [ ] Implementar endpoints REST de periodos
- [ ] Criar tela de periodos por aluguel

## Fase 8: Interface Profissional
- [ ] Criar layout administrativo base
- [ ] Criar menu lateral e cabecalho padrao
- [ ] Padronizar tabelas, filtros e estados vazios
- [ ] Padronizar confirmacoes de exclusao
- [ ] Padronizar mensagens de sucesso e erro
- [ ] Revisar responsividade para desktop e tablet

## Fase 9: Banco e Escalabilidade
- [ ] Validar funcionamento completo com SQLite
- [ ] Testar migrations e queries em PostgreSQL
- [ ] Mapear adaptacoes necessarias para Oracle
- [ ] Garantir backend stateless para uso com load balancer
- [ ] Planejar deploy com multiplas instancias da API para PostgreSQL ou Oracle

## Fase 10: Qualidade
- [ ] Criar testes de validacao de dominio
- [ ] Criar testes de repositorio compartilhados entre bancos
- [ ] Criar testes de integracao da API
- [ ] Validar fluxo ponta a ponta dos principais cadastros
- [ ] Revisar duplicacoes de codigo antes da primeira entrega

## Ordem Recomendada de Execucao
1. Fundacao
2. Dominio Compartilhado
3. Pessoas
4. Imoveis
5. Proprietarios de Imovel
6. Alugueis
7. Periodos Anuais
8. Interface Profissional
9. Banco e Escalabilidade
10. Qualidade
