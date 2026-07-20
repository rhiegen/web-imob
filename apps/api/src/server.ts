import express from 'express';
import cors from 'cors';
import { Pool, type PoolClient } from 'pg';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  aluguelSchema,
  imovelSchema,
  pessoaSchema,
  type Aluguel,
  type AluguelInput,
  type AluguelPeriodo,
  type Imovel,
  type ImovelInput,
  type Pessoa,
  type PessoaInput,
} from '@imob/shared';
import { randomUUID } from 'node:crypto';

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});
const currentDir = dirname(fileURLToPath(import.meta.url));
const webDistPath = join(currentDir, '../../web/dist');

app.get('/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ status: 'ok', mode: 'postgres', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: getErrorMessage(error) });
  }
});

app.get('/pessoas', async (_req, res, next) => {
  try {
    res.json(await listPessoas());
  } catch (error) {
    next(error);
  }
});

app.get('/pessoas/:id', async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      res.json(await getPessoaById(client, req.params.id));
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

app.post('/pessoas', async (req, res, next) => {
  try {
    const input = pessoaSchema.parse(req.body);
    res.status(201).json(await createPessoa(input));
  } catch (error) {
    next(error);
  }
});

app.put('/pessoas/:id', async (req, res, next) => {
  try {
    const input = pessoaSchema.parse(req.body);
    res.json(await updatePessoa(req.params.id, input));
  } catch (error) {
    next(error);
  }
});

app.delete('/pessoas/:id', async (req, res, next) => {
  try {
    await removeById('pessoas', req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/imoveis', async (_req, res, next) => {
  try {
    res.json(await listImoveis());
  } catch (error) {
    next(error);
  }
});

app.get('/imoveis/:id', async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      res.json(await getImovelById(client, req.params.id));
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

app.post('/imoveis', async (req, res, next) => {
  try {
    const input = imovelSchema.parse(req.body);
    res.status(201).json(await createImovel(input));
  } catch (error) {
    next(error);
  }
});

app.put('/imoveis/:id', async (req, res, next) => {
  try {
    const input = imovelSchema.parse(req.body);
    res.json(await updateImovel(req.params.id, input));
  } catch (error) {
    next(error);
  }
});

app.delete('/imoveis/:id', async (req, res, next) => {
  try {
    await removeById('imoveis', req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/alugueis', async (_req, res, next) => {
  try {
    res.json(await listAlugueis());
  } catch (error) {
    next(error);
  }
});

app.get('/alugueis/:id', async (req, res, next) => {
  try {
    const client = await pool.connect();
    try {
      res.json(await getAluguelById(client, req.params.id));
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

app.post('/alugueis', async (req, res, next) => {
  try {
    const input = aluguelSchema.parse(req.body);
    res.status(201).json(await createAluguel(input));
  } catch (error) {
    next(error);
  }
});

app.put('/alugueis/:id', async (req, res, next) => {
  try {
    const input = aluguelSchema.parse(req.body);
    res.json(await updateAluguel(req.params.id, input));
  } catch (error) {
    next(error);
  }
});

app.delete('/alugueis/:id', async (req, res, next) => {
  try {
    await removeById('alugueis', req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

if (existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/pessoas') || req.path.startsWith('/imoveis') || req.path.startsWith('/alugueis') || req.path === '/health') {
      next();
      return;
    }

    res.sendFile(join(webDistPath, 'index.html'));
  });
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (hasZodShape(error)) {
    res.status(400).json({
      message: 'Dados invalidos',
      details: error.issues.map((issue) => issue.message),
    });
    return;
  }

  res.status(500).json({ message: getErrorMessage(error) });
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`API real rodando na porta ${port}`);
});

async function listPessoas() {
  const { rows } = await pool.query<Pessoa>(`
    select
      p.id,
      p.codigo,
      p.nome,
      p.documento_fiscal as "documentoFiscal",
      p.identidade,
      to_char(p.data_nascimento, 'YYYY-MM-DD') as "dataNascimento",
      p.cidade_nascimento as "cidadeNascimento",
      p.pais,
      p.profissao,
      p.renda::float as renda,
      p.tipo_logradouro as "tipoLogradouro",
      p.logradouro,
      p.numero,
      coalesce(p.complemento, '') as complemento,
      p.bairro,
      p.cidade,
      p.estado,
      p.cep,
      coalesce(array_remove(array_agg(pp.papel order by pp.papel), null), '{}') as papeis
    from pessoas p
    left join pessoa_papeis pp on pp.pessoa_id = p.id
    group by p.id
    order by p.nome asc
  `);

  return rows;
}

async function createPessoa(input: PessoaInput) {
  return withTransaction(async (client) => {
    const id = randomUUID();
    const codigo = await nextCode(client, 'P', 'pessoas');

    await client.query(
      `
        insert into pessoas (
          id, codigo, nome, documento_fiscal, identidade, data_nascimento,
          cidade_nascimento, pais, profissao, renda, tipo_logradouro,
          logradouro, numero, complemento, bairro, cidade, estado, cep
        ) values (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18
        )
      `,
      [
        id,
        codigo,
        input.nome,
        input.documentoFiscal,
        input.identidade,
        input.dataNascimento,
        input.cidadeNascimento,
        input.pais,
        input.profissao,
        input.renda,
        input.tipoLogradouro,
        input.logradouro,
        input.numero,
        input.complemento,
        input.bairro,
        input.cidade,
        input.estado,
        input.cep,
      ],
    );

    await replacePessoaPapeis(client, id, input.papeis);
    return getPessoaById(client, id);
  });
}

async function updatePessoa(id: string, input: PessoaInput) {
  return withTransaction(async (client) => {
    await ensureExists(client, 'pessoas', id);
    await client.query(
      `
        update pessoas
        set nome = $2,
            documento_fiscal = $3,
            identidade = $4,
            data_nascimento = $5,
            cidade_nascimento = $6,
            pais = $7,
            profissao = $8,
            renda = $9,
            tipo_logradouro = $10,
            logradouro = $11,
            numero = $12,
            complemento = $13,
            bairro = $14,
            cidade = $15,
            estado = $16,
            cep = $17,
            updated_at = now()
        where id = $1
      `,
      [
        id,
        input.nome,
        input.documentoFiscal,
        input.identidade,
        input.dataNascimento,
        input.cidadeNascimento,
        input.pais,
        input.profissao,
        input.renda,
        input.tipoLogradouro,
        input.logradouro,
        input.numero,
        input.complemento,
        input.bairro,
        input.cidade,
        input.estado,
        input.cep,
      ],
    );
    await replacePessoaPapeis(client, id, input.papeis);
    return getPessoaById(client, id);
  });
}

async function listImoveis() {
  const { rows } = await pool.query<Imovel>(`
    select
      i.id,
      i.codigo,
      i.descricao_breve as "descricaoBreve",
      i.descricao_detalhada as "descricaoDetalhada",
      i.valor_aluguel::float as "valorAluguel",
      i.moeda,
      coalesce(i.url_anuncio, '') as "urlAnuncio",
      i.bairro_localidade as "bairroLocalidade",
      i.numero_quartos as "numeroQuartos",
      i.tipo_quarto as "tipoQuarto",
      i.metros_quadrados_construidos::float as "metrosQuadradosConstruidos",
      i.tipo_imovel as "tipoImovel",
      i.tipo_lavanderia as "tipoLavanderia",
      i.tipo_cozinha as "tipoCozinha",
      i.area_gourmet_tipo as "areaGourmetTipo",
      i.area_gourmet_metros_quadrados::float as "areaGourmetMetrosQuadrados",
      coalesce(array_remove(array_agg(ip.pessoa_id order by ip.created_at), null), '{}') as "proprietarioIds"
    from imoveis i
    left join imovel_proprietarios ip on ip.imovel_id = i.id and ip.data_fim is null
    group by i.id
    order by i.codigo asc
  `);

  return rows.map((row: Imovel) => ({ ...row, areaGourmetMetrosQuadrados: row.areaGourmetMetrosQuadrados ?? 0 }));
}

async function createImovel(input: ImovelInput) {
  return withTransaction(async (client) => {
    const id = randomUUID();
    const codigo = await nextCode(client, 'IM', 'imoveis');

    await client.query(
      `
        insert into imoveis (
          id, codigo, descricao_breve, descricao_detalhada, valor_aluguel, moeda,
          url_anuncio, bairro_localidade, numero_quartos, tipo_quarto,
          metros_quadrados_construidos, tipo_imovel, tipo_lavanderia,
          tipo_cozinha, area_gourmet_tipo, area_gourmet_metros_quadrados
        ) values (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16
        )
      `,
      [
        id,
        codigo,
        input.descricaoBreve,
        input.descricaoDetalhada,
        input.valorAluguel,
        input.moeda,
        input.urlAnuncio,
        input.bairroLocalidade,
        input.numeroQuartos,
        input.tipoQuarto,
        input.metrosQuadradosConstruidos,
        input.tipoImovel,
        input.tipoLavanderia,
        input.tipoCozinha,
        input.areaGourmetTipo,
        input.areaGourmetMetrosQuadrados,
      ],
    );

    await replaceImovelProprietarios(client, id, input.proprietarioIds);
    return getImovelById(client, id);
  });
}

async function updateImovel(id: string, input: ImovelInput) {
  return withTransaction(async (client) => {
    await ensureExists(client, 'imoveis', id);
    await client.query(
      `
        update imoveis
        set descricao_breve = $2,
            descricao_detalhada = $3,
            valor_aluguel = $4,
            moeda = $5,
            url_anuncio = $6,
            bairro_localidade = $7,
            numero_quartos = $8,
            tipo_quarto = $9,
            metros_quadrados_construidos = $10,
            tipo_imovel = $11,
            tipo_lavanderia = $12,
            tipo_cozinha = $13,
            area_gourmet_tipo = $14,
            area_gourmet_metros_quadrados = $15,
            updated_at = now()
        where id = $1
      `,
      [
        id,
        input.descricaoBreve,
        input.descricaoDetalhada,
        input.valorAluguel,
        input.moeda,
        input.urlAnuncio,
        input.bairroLocalidade,
        input.numeroQuartos,
        input.tipoQuarto,
        input.metrosQuadradosConstruidos,
        input.tipoImovel,
        input.tipoLavanderia,
        input.tipoCozinha,
        input.areaGourmetTipo,
        input.areaGourmetMetrosQuadrados,
      ],
    );

    await replaceImovelProprietarios(client, id, input.proprietarioIds);
    return getImovelById(client, id);
  });
}

async function listAlugueis() {
  const { rows } = await pool.query<(Omit<Aluguel, 'periodos'> & { periodos: unknown })>(`
    select
      a.id,
      a.codigo,
      a.imovel_id as "imovelId",
      a.locador_id as "locadorId",
      a.locatario_id as "locatarioId",
      to_char(a.data_inicio, 'YYYY-MM-DD') as "dataInicio",
      to_char(a.data_fim, 'YYYY-MM-DD') as "dataFim",
      a.clausula_extensao_apos_prazo_original as "clausulaExtensaoAposPrazoOriginal",
      a.valor_acordado_aluguel::float as "valorAcordadoAluguel",
      a.indice_reajuste as "indiceReajuste",
      a.percentual_reajuste::float as "percentualReajuste",
      coalesce(
        json_agg(
          json_build_object(
            'id', ap.id,
            'periodo', ap.periodo,
            'dataInicioPeriodo', to_char(ap.data_inicio_periodo, 'YYYY-MM-DD'),
            'dataFimPeriodo', to_char(ap.data_fim_periodo, 'YYYY-MM-DD'),
            'valorAcordadoAluguel', ap.valor_acordado_aluguel::float,
            'indiceReajuste', ap.indice_reajuste,
            'percentualReajuste', ap.percentual_reajuste::float
          ) order by ap.periodo
        ) filter (where ap.id is not null),
        '[]'::json
      ) as periodos
    from alugueis a
    left join aluguel_periodos ap on ap.aluguel_id = a.id
    group by a.id
    order by a.codigo asc
  `);

  return rows.map((row) => ({ ...row, periodos: row.periodos as AluguelPeriodo[] }));
}

async function createAluguel(input: AluguelInput) {
  validatePeriodos(input.periodos);
  return withTransaction(async (client) => {
    const id = randomUUID();
    const codigo = await nextCode(client, 'AL', 'alugueis');

    await client.query(
      `
        insert into alugueis (
          id, codigo, imovel_id, locador_id, locatario_id,
          data_inicio, data_fim, clausula_extensao_apos_prazo_original,
          valor_acordado_aluguel, indice_reajuste, percentual_reajuste
        ) values (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11
        )
      `,
      [
        id,
        codigo,
        input.imovelId,
        input.locadorId,
        input.locatarioId,
        input.dataInicio,
        input.dataFim,
        input.clausulaExtensaoAposPrazoOriginal,
        input.valorAcordadoAluguel,
        input.indiceReajuste,
        input.percentualReajuste,
      ],
    );

    await replaceAluguelPeriodos(client, id, input.periodos);
    return getAluguelById(client, id);
  });
}

async function updateAluguel(id: string, input: AluguelInput) {
  validatePeriodos(input.periodos);
  return withTransaction(async (client) => {
    await ensureExists(client, 'alugueis', id);
    await client.query(
      `
        update alugueis
        set imovel_id = $2,
            locador_id = $3,
            locatario_id = $4,
            data_inicio = $5,
            data_fim = $6,
            clausula_extensao_apos_prazo_original = $7,
            valor_acordado_aluguel = $8,
            indice_reajuste = $9,
            percentual_reajuste = $10,
            updated_at = now()
        where id = $1
      `,
      [
        id,
        input.imovelId,
        input.locadorId,
        input.locatarioId,
        input.dataInicio,
        input.dataFim,
        input.clausulaExtensaoAposPrazoOriginal,
        input.valorAcordadoAluguel,
        input.indiceReajuste,
        input.percentualReajuste,
      ],
    );

    await replaceAluguelPeriodos(client, id, input.periodos);
    return getAluguelById(client, id);
  });
}

async function getPessoaById(client: PoolClient, id: string) {
  const pessoas = await client.query<Pessoa>(`
    select
      p.id,
      p.codigo,
      p.nome,
      p.documento_fiscal as "documentoFiscal",
      p.identidade,
      to_char(p.data_nascimento, 'YYYY-MM-DD') as "dataNascimento",
      p.cidade_nascimento as "cidadeNascimento",
      p.pais,
      p.profissao,
      p.renda::float as renda,
      p.tipo_logradouro as "tipoLogradouro",
      p.logradouro,
      p.numero,
      coalesce(p.complemento, '') as complemento,
      p.bairro,
      p.cidade,
      p.estado,
      p.cep,
      coalesce(array_remove(array_agg(pp.papel order by pp.papel), null), '{}') as papeis
    from pessoas p
    left join pessoa_papeis pp on pp.pessoa_id = p.id
    where p.id = $1
    group by p.id
  `, [id]);
  return oneOrThrow(pessoas.rows[0], 'Pessoa nao encontrada');
}

async function getImovelById(client: PoolClient, id: string) {
  const result = await client.query<Imovel>(`
    select
      i.id,
      i.codigo,
      i.descricao_breve as "descricaoBreve",
      i.descricao_detalhada as "descricaoDetalhada",
      i.valor_aluguel::float as "valorAluguel",
      i.moeda,
      coalesce(i.url_anuncio, '') as "urlAnuncio",
      i.bairro_localidade as "bairroLocalidade",
      i.numero_quartos as "numeroQuartos",
      i.tipo_quarto as "tipoQuarto",
      i.metros_quadrados_construidos::float as "metrosQuadradosConstruidos",
      i.tipo_imovel as "tipoImovel",
      i.tipo_lavanderia as "tipoLavanderia",
      i.tipo_cozinha as "tipoCozinha",
      i.area_gourmet_tipo as "areaGourmetTipo",
      i.area_gourmet_metros_quadrados::float as "areaGourmetMetrosQuadrados",
      coalesce(array_remove(array_agg(ip.pessoa_id order by ip.created_at), null), '{}') as "proprietarioIds"
    from imoveis i
    left join imovel_proprietarios ip on ip.imovel_id = i.id and ip.data_fim is null
    where i.id = $1
    group by i.id
  `, [id]);
  return oneOrThrow(result.rows[0], 'Imovel nao encontrado');
}

async function getAluguelById(client: PoolClient, id: string) {
  const result = await client.query<(Omit<Aluguel, 'periodos'> & { periodos: unknown })>(`
    select
      a.id,
      a.codigo,
      a.imovel_id as "imovelId",
      a.locador_id as "locadorId",
      a.locatario_id as "locatarioId",
      to_char(a.data_inicio, 'YYYY-MM-DD') as "dataInicio",
      to_char(a.data_fim, 'YYYY-MM-DD') as "dataFim",
      a.clausula_extensao_apos_prazo_original as "clausulaExtensaoAposPrazoOriginal",
      a.valor_acordado_aluguel::float as "valorAcordadoAluguel",
      a.indice_reajuste as "indiceReajuste",
      a.percentual_reajuste::float as "percentualReajuste",
      coalesce(
        json_agg(
          json_build_object(
            'id', ap.id,
            'periodo', ap.periodo,
            'dataInicioPeriodo', to_char(ap.data_inicio_periodo, 'YYYY-MM-DD'),
            'dataFimPeriodo', to_char(ap.data_fim_periodo, 'YYYY-MM-DD'),
            'valorAcordadoAluguel', ap.valor_acordado_aluguel::float,
            'indiceReajuste', ap.indice_reajuste,
            'percentualReajuste', ap.percentual_reajuste::float
          ) order by ap.periodo
        ) filter (where ap.id is not null),
        '[]'::json
      ) as periodos
    from alugueis a
    left join aluguel_periodos ap on ap.aluguel_id = a.id
    where a.id = $1
    group by a.id
  `, [id]);

  const row = oneOrThrow(result.rows[0], 'Aluguel nao encontrado');
  return { ...row, periodos: row.periodos as AluguelPeriodo[] };
}

async function replacePessoaPapeis(client: PoolClient, pessoaId: string, papeis: PessoaInput['papeis']) {
  await client.query('delete from pessoa_papeis where pessoa_id = $1', [pessoaId]);
  for (const papel of papeis) {
    await client.query('insert into pessoa_papeis (id, pessoa_id, papel) values ($1, $2, $3)', [randomUUID(), pessoaId, papel]);
  }
}

async function replaceImovelProprietarios(client: PoolClient, imovelId: string, proprietarioIds: string[]) {
  await client.query('delete from imovel_proprietarios where imovel_id = $1', [imovelId]);
  for (const pessoaId of proprietarioIds) {
    await client.query(
      'insert into imovel_proprietarios (id, imovel_id, pessoa_id, data_inicio, principal) values ($1, $2, $3, current_date, $4)',
      [randomUUID(), imovelId, pessoaId, 1],
    );
  }
}

async function replaceAluguelPeriodos(client: PoolClient, aluguelId: string, periodos: AluguelInput['periodos']) {
  await client.query('delete from aluguel_periodos where aluguel_id = $1', [aluguelId]);
  for (const periodo of periodos) {
    await client.query(
      `
        insert into aluguel_periodos (
          id, aluguel_id, periodo, data_inicio_periodo,
          data_fim_periodo, valor_acordado_aluguel, indice_reajuste, percentual_reajuste
        ) values ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        periodo.id ?? randomUUID(),
        aluguelId,
        periodo.periodo,
        periodo.dataInicioPeriodo,
        periodo.dataFimPeriodo,
        periodo.valorAcordadoAluguel,
        periodo.indiceReajuste,
        periodo.percentualReajuste,
      ],
    );
  }
}

async function removeById(table: 'pessoas' | 'imoveis' | 'alugueis', id: string) {
  const result = await pool.query(`delete from ${table} where id = $1`, [id]);
  if (result.rowCount === 0) {
    throw new Error('Registro nao encontrado');
  }
}

async function nextCode(client: PoolClient, prefix: string, table: 'pessoas' | 'imoveis' | 'alugueis') {
  const { rows } = await client.query<{ codigo: string }>(`select codigo from ${table} where codigo like $1 order by codigo desc limit 1`, [`${prefix}%`]);
  const current = rows[0]?.codigo;
  const next = current ? Number(current.replace(prefix, '')) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

async function ensureExists(client: PoolClient, table: 'pessoas' | 'imoveis' | 'alugueis', id: string) {
  const result = await client.query(`select id from ${table} where id = $1`, [id]);
  if (result.rowCount === 0) {
    throw new Error('Registro nao encontrado');
  }
}

async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const result = await callback(client);
    await client.query('commit');
    return result;
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

function validatePeriodos(periodos: AluguelInput['periodos']) {
  const ordered = [...periodos].sort((a, b) => a.periodo - b.periodo);
  for (let index = 0; index < ordered.length; index += 1) {
    if (ordered[index].periodo !== index + 1) {
      throw new Error('Os periodos devem ser sequenciais a partir de 1');
    }
  }
}

function oneOrThrow<T>(value: T | undefined, message: string) {
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Erro interno';
}

function hasZodShape(error: unknown): error is { issues: Array<{ message: string }> } {
  return typeof error === 'object' && error !== null && 'issues' in error;
}
