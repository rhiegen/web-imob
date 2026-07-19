# Imob Admin

Sistema web imobiliario com:
- React + TypeScript no frontend
- Node.js + Express no backend
- PostgreSQL/Supabase na persistencia atual
- tema dark, acessibilidade e traducao da interface

## Rodando localmente
1. copie `.env.example` para `.env`
2. ajuste `DATABASE_URL`
3. gere secrets se necessario:

```bash
npm run secrets:generate
```

3. execute o schema no banco:

```bash
bash ./deploy/init-supabase.sh
```

3.1. opcionalmente carregue dados iniciais:

```bash
bash ./deploy/seed.sh
```

4. instale dependencias e rode o projeto:

```bash
npm install
./run-local.sh
```

## Build
```bash
npm run build
```

## Scripts principais
- `./run-local.sh`: sobe o projeto local
- `bash ./deploy/init-supabase.sh`: cria o banco e as tabelas no Supabase/PostgreSQL
- `bash ./deploy/seed.sh`: insere dados iniciais reais de exemplo
- `bash ./deploy/backup-local.sh`: exporta o banco local Docker para um arquivo `.sql`
- `bash ./deploy/generate-secrets.sh`: gera `APP_SECRET` e `SESSION_SECRET` automaticamente
- `bash ./deploy/install-vps.sh`: instala o projeto em uma VPS Linux
- `bash ./deploy/setup-vps.sh`: executa banco + instalacao de VPS em sequencia

## Deploy em VPS
1. configure o `.env` com `DATABASE_URL`
2. rode `bash ./deploy/setup-vps.sh`
4. inicie o servico:

```bash
sudo systemctl start imob-admin.service
```
