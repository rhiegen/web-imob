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

## Docker
Build da imagem:

```bash
docker build -t web-imob-admin .
```

Execucao do container:

```bash
docker run --rm -p 3001:3001 --env-file .env web-imob-admin
```

Ou com compose na VPS:

```bash
docker compose -f docker-compose.vps.yml up -d --build
```

## Scripts principais
- `./run-local.sh`: sobe o projeto local
- `bash ./deploy/init-supabase.sh`: cria o banco e as tabelas no Supabase/PostgreSQL
- `bash ./deploy/seed.sh`: insere dados iniciais reais de exemplo
- `bash ./deploy/backup-local.sh`: exporta o banco local Docker para um arquivo `.sql`
- `bash ./deploy/generate-secrets.sh`: gera `APP_SECRET` e `SESSION_SECRET` automaticamente
- `bash ./deploy/install-vps.sh`: instala o projeto em uma VPS Linux
- `bash ./deploy/setup-vps.sh`: executa banco + instalacao de VPS em sequencia

## GitHub Actions para VPS
Workflow disponivel:
- `.github/workflows/deploy-vps.yml`

Secrets esperados no repositório GitHub:
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_DEPLOY_PATH`

## Deploy em VPS
1. copie `.env.vps.example` para `.env`
2. configure `DATABASE_URL`, `DB_SSL` e `VITE_API_URL`
3. rode `npm install`
4. rode `bash ./deploy/setup-vps.sh`
5. inicie o servico:

```bash
sudo systemctl start imob-admin.service
```

Guia rapido:
- `deploy/DEPLOY-VPS.md`

Alternativa com container:
- use o `Dockerfile` na raiz do projeto para buildar e executar a aplicacao na VPS
- ou use `docker-compose.vps.yml` para subir a aplicacao com um unico comando
- ou use `docker-compose.vps.full.yml` para subir app + Nginx em conjunto

Comando unico para Docker + Nginx:

```bash
bash ./deploy/setup-vps-docker.sh
```

Arquivos de infraestrutura:
- `deploy/nginx.conf`
- `docker-compose.vps.full.yml`
- `deploy/PRODUCTION-CHECKLIST.md`
