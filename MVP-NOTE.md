# MVP Demonstrativo

Este bootstrap foi criado apenas para demonstracao visual e estrutural.

## O que esta implementado agora
- monorepo inicial com `apps/web`, `apps/api` e `packages/shared`
- frontend React + TypeScript
- API simples em memoria
- dados fake para pessoas, imoveis e alugueis
- tipagem compartilhada
- execucao local com um unico comando

## O que ainda nao foi implementado
- banco SQLite real
- suporte real a PostgreSQL ou Oracle
- CRUD persistente
- autenticacao
- validacoes de dominio completas
- balanceamento de carga em ambiente real

## Regra para a proxima etapa
Nao implementar persistencia real nem regras definitivas ate que voce diga exatamente:

`implemente de fato`

## Como rodar localmente
1. `npm install`
2. `npm run dev`

URLs:
- frontend: `http://localhost:5173`
- API fake: `http://localhost:3001`
