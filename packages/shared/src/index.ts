import { z } from 'zod';

export const papelPessoaOptions = ['locador', 'locatario', 'proprietario'] as const;
export const tipoLogradouroOptions = ['Rua', 'Praca', 'Avenida', 'Quadra'] as const;
export const tipoQuartoOptions = ['suite', 'solteiro', 'casal', 'casal suite'] as const;
export const tipoImovelOptions = [
  'casa terrea',
  'casa geminada',
  'apartamento',
  'casa duplex',
  'apartamento duplex',
  'apartamento triplex',
  'cobertura',
  'casa tipo sobrado',
] as const;
export const tipoLavanderiaOptions = ['ampla', 'anexa a cozinha'] as const;
export const tipoCozinhaOptions = ['americana', 'comum'] as const;
export const areaGourmetTipoOptions = ['simples', 'na varanda', 'ampla com churrasqueira'] as const;

export type PapelPessoa = (typeof papelPessoaOptions)[number];
export type TipoLogradouro = (typeof tipoLogradouroOptions)[number];
export type TipoQuarto = (typeof tipoQuartoOptions)[number];
export type TipoImovel = (typeof tipoImovelOptions)[number];
export type TipoLavanderia = (typeof tipoLavanderiaOptions)[number];
export type TipoCozinha = (typeof tipoCozinhaOptions)[number];
export type AreaGourmetTipo = (typeof areaGourmetTipoOptions)[number];

const requiredString = (message: string) => z.string().trim().min(1, message);

export const pessoaSchema = z.object({
  nome: requiredString('Nome obrigatorio'),
  documentoFiscal: requiredString('Documento fiscal obrigatorio'),
  identidade: requiredString('Identidade obrigatoria'),
  dataNascimento: requiredString('Data de nascimento obrigatoria'),
  cidadeNascimento: requiredString('Cidade de nascimento obrigatoria'),
  pais: requiredString('Pais obrigatorio'),
  profissao: requiredString('Profissao obrigatoria'),
  renda: z.coerce.number().min(0, 'Renda deve ser positiva'),
  tipoLogradouro: z.enum(tipoLogradouroOptions),
  logradouro: requiredString('Logradouro obrigatorio'),
  numero: requiredString('Numero obrigatorio'),
  complemento: z.string().trim().optional().default(''),
  bairro: requiredString('Bairro obrigatorio'),
  cidade: requiredString('Cidade obrigatoria'),
  estado: requiredString('Estado obrigatorio'),
  cep: requiredString('CEP obrigatorio'),
  papeis: z.array(z.enum(papelPessoaOptions)).min(1, 'Selecione ao menos um papel'),
});

export const imovelSchema = z.object({
  descricaoBreve: requiredString('Descricao breve obrigatoria'),
  descricaoDetalhada: requiredString('Descricao detalhada obrigatoria'),
  valorAluguel: z.coerce.number().min(0, 'Valor do aluguel deve ser positivo'),
  moeda: requiredString('Moeda obrigatoria'),
  urlAnuncio: z.string().trim().optional().default(''),
  bairroLocalidade: requiredString('Bairro ou localidade obrigatorio'),
  numeroQuartos: z.coerce.number().int().min(0, 'Numero de quartos invalido'),
  tipoQuarto: z.enum(tipoQuartoOptions),
  metrosQuadradosConstruidos: z.coerce.number().min(0, 'Metros quadrados invalidos'),
  tipoImovel: z.enum(tipoImovelOptions),
  tipoLavanderia: z.enum(tipoLavanderiaOptions),
  tipoCozinha: z.enum(tipoCozinhaOptions),
  areaGourmetTipo: z.enum(areaGourmetTipoOptions),
  areaGourmetMetrosQuadrados: z.coerce.number().min(0, 'Area gourmet invalida').optional().default(0),
  proprietarioIds: z.array(z.string().uuid('Proprietario invalido')).min(1, 'Selecione ao menos um proprietario'),
});

export const aluguelPeriodoSchema = z.object({
  id: z.string().uuid().optional(),
  periodo: z.coerce.number().int().min(1, 'Periodo invalido'),
  dataInicioPeriodo: requiredString('Inicio do periodo obrigatorio'),
  dataFimPeriodo: requiredString('Fim do periodo obrigatorio'),
  valorAcordadoAluguel: z.coerce.number().min(0, 'Valor do periodo invalido'),
  indiceReajuste: requiredString('Indice de reajuste obrigatorio'),
  percentualReajuste: z.coerce.number().min(0, 'Percentual invalido'),
});

export const aluguelSchema = z.object({
  imovelId: z.string().uuid('Imovel invalido'),
  locadorId: z.string().uuid('Locador invalido'),
  locatarioId: z.string().uuid('Locatario invalido'),
  dataInicio: requiredString('Data de inicio obrigatoria'),
  dataFim: requiredString('Data final obrigatoria'),
  clausulaExtensaoAposPrazoOriginal: requiredString('Clausula obrigatoria'),
  valorAcordadoAluguel: z.coerce.number().min(0, 'Valor do aluguel invalido'),
  indiceReajuste: requiredString('Indice de reajuste obrigatorio'),
  percentualReajuste: z.coerce.number().min(0, 'Percentual invalido'),
  periodos: z.array(aluguelPeriodoSchema).min(1, 'Informe ao menos um periodo'),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
export type ImovelInput = z.infer<typeof imovelSchema>;
export type AluguelPeriodoInput = z.infer<typeof aluguelPeriodoSchema>;
export type AluguelInput = z.infer<typeof aluguelSchema>;

export interface Pessoa extends PessoaInput {
  id: string;
  codigo: string;
}

export interface Imovel extends ImovelInput {
  id: string;
  codigo: string;
}

export interface AluguelPeriodo extends Omit<AluguelPeriodoInput, 'id'> {
  id: string;
}

export interface Aluguel extends Omit<AluguelInput, 'periodos'> {
  id: string;
  codigo: string;
  periodos: AluguelPeriodo[];
}

export interface ApiError {
  message: string;
  details?: string[];
}
