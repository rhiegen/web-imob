# Deploy VPS

## Primeira Instalacao
1. Descompacte o projeto na VPS.
2. Copie `.env.vps.example` para `.env`.
3. Ajuste `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`.
4. Rode `npm install`.
5. Rode `bash ./deploy/setup-vps.sh`.
6. Inicie o servico com `sudo systemctl start imob-admin.service`.
7. Valide com `sudo systemctl status imob-admin.service` e `curl http://localhost:3001/health`.

## O que a primeira rodada faz
- gera `APP_SECRET` e `SESSION_SECRET` automaticamente se estiverem vazios
- cria banco, tabelas, indices e relacionamentos usando `deploy/init-supabase.sh`
- instala a aplicacao em `/opt/imob-admin`
- registra e habilita o servico `systemd`

## Dados iniciais
Se quiser dados iniciais de exemplo antes de subir em producao:

```bash
bash ./deploy/seed.sh
```

## Atualizacao posterior
1. Atualize os arquivos do projeto.
2. Rode `bash ./deploy/install-vps.sh`.
3. Reinicie com `sudo systemctl restart imob-admin.service`.
