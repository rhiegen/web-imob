# Checklist Producao

## Infra
- [ ] VPS atualizada
- [ ] Docker e Docker Compose instalados
- [ ] DNS apontando para a VPS
- [ ] portas 80 e 443 liberadas

## Aplicacao
- [ ] `.env.vps.example` copiado para `.env`
- [ ] `DATABASE_URL` configurado
- [ ] `DB_SSL=true` configurado para Supabase
- [ ] `VITE_API_URL` configurado com dominio final
- [ ] `APP_SECRET` e `SESSION_SECRET` gerados

## Banco
- [ ] schema aplicado com `bash ./deploy/init-supabase.sh`
- [ ] seed aplicado apenas se desejado com `bash ./deploy/seed.sh`
- [ ] acesso ao banco validado

## Container
- [ ] build validado com `docker build -t web-imob-admin .`
- [ ] stack subida com `docker compose -f docker-compose.vps.full.yml up -d --build`
- [ ] logs verificados com `docker compose -f docker-compose.vps.full.yml logs -f`

## Validacao funcional
- [ ] `GET /health` retorna sucesso
- [ ] frontend abre no dominio
- [ ] CRUD de pessoas funciona
- [ ] CRUD de imoveis funciona
- [ ] CRUD de alugueis funciona

## Pos-deploy
- [ ] backup do banco configurado
- [ ] monitoramento basico configurado
- [ ] estrategia de HTTPS definida com proxy externo ou certbot
