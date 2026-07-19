import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  aluguelSchema,
  areaGourmetTipoOptions,
  imovelSchema,
  papelPessoaOptions,
  pessoaSchema,
  tipoCozinhaOptions,
  tipoImovelOptions,
  tipoLavanderiaOptions,
  tipoLogradouroOptions,
  tipoQuartoOptions,
  type Aluguel,
  type AluguelInput,
  type AluguelPeriodoInput,
  type Imovel,
  type ImovelInput,
  type Pessoa,
  type PessoaInput,
} from '@imob/shared';
import { dictionaries, localeNames, locales, type Locale } from './i18n';

type View = 'dashboard' | 'pessoas' | 'imoveis' | 'alugueis';
type FontScale = 0.95 | 1 | 1.12;

const fontScales: FontScale[] = [0.95, 1, 1.12];
const API_URL = import.meta.env.VITE_API_URL ?? window.location.origin;

const emptyPessoaForm: PessoaInput = {
  nome: '',
  documentoFiscal: '',
  identidade: '',
  dataNascimento: '',
  cidadeNascimento: '',
  pais: 'Brasil',
  profissao: '',
  renda: 0,
  tipoLogradouro: 'Rua',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  papeis: ['locador'],
};

const emptyImovelForm: ImovelInput = {
  descricaoBreve: '',
  descricaoDetalhada: '',
  valorAluguel: 0,
  moeda: 'BRL',
  urlAnuncio: '',
  bairroLocalidade: '',
  numeroQuartos: 1,
  tipoQuarto: 'suite',
  metrosQuadradosConstruidos: 0,
  tipoImovel: 'apartamento',
  tipoLavanderia: 'ampla',
  tipoCozinha: 'americana',
  areaGourmetTipo: 'simples',
  areaGourmetMetrosQuadrados: 0,
  proprietarioIds: [],
};

const emptyPeriodo = (periodo: number): AluguelPeriodoInput => ({
  periodo,
  dataInicioPeriodo: '',
  dataFimPeriodo: '',
  valorAcordadoAluguel: 0,
  indiceReajuste: 'IPCA',
  percentualReajuste: 0,
});

const emptyAluguelForm: AluguelInput = {
  imovelId: '',
  locadorId: '',
  locatarioId: '',
  dataInicio: '',
  dataFim: '',
  clausulaExtensaoAposPrazoOriginal: '',
  valorAcordadoAluguel: 0,
  indiceReajuste: 'IPCA',
  percentualReajuste: 0,
  periodos: [emptyPeriodo(1)],
};

export function App() {
  const [view, setView] = useState<View>('dashboard');
  const [locale, setLocale] = useState<Locale>('pt-BR');
  const [fontScaleIndex, setFontScaleIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [editingPessoaId, setEditingPessoaId] = useState<string | null>(null);
  const [editingImovelId, setEditingImovelId] = useState<string | null>(null);
  const [editingAluguelId, setEditingAluguelId] = useState<string | null>(null);
  const [pessoaForm, setPessoaForm] = useState<PessoaInput>(emptyPessoaForm);
  const [imovelForm, setImovelForm] = useState<ImovelInput>(emptyImovelForm);
  const [aluguelForm, setAluguelForm] = useState<AluguelInput>(emptyAluguelForm);

  const text = dictionaries[locale];
  const ui = uiText(locale);
  const fontScale = fontScales[fontScaleIndex];

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${text.appTitle} | ${text.heroTitle}`;
  }, [locale, text.appTitle, text.heroTitle]);

  const dashboard = useMemo(
    () => ({
      pessoas: pessoas.length,
      imoveis: imoveis.length,
      alugueis: alugueis.length,
      rendaMedia: pessoas.length ? pessoas.reduce((total, item) => total + item.renda, 0) / pessoas.length : 0,
    }),
    [alugueis.length, imoveis.length, pessoas],
  );

  async function loadAll() {
    setLoading(true);
    try {
      const [pessoasData, imoveisData, alugueisData] = await Promise.all([
        apiRequest<Pessoa[]>('/pessoas'),
        apiRequest<Imovel[]>('/imoveis'),
        apiRequest<Aluguel[]>('/alugueis'),
      ]);
      setPessoas(pessoasData);
      setImoveis(imoveisData);
      setAlugueis(alugueisData);
      setMessage('');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handlePessoaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = pessoaSchema.parse(pessoaForm);
      if (editingPessoaId) {
        await apiRequest(`/pessoas/${editingPessoaId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/pessoas', { method: 'POST', body: JSON.stringify(payload) });
      }
      resetPessoaForm();
      await loadAll();
      setMessage(ui.saved);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleImovelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = imovelSchema.parse(imovelForm);
      if (editingImovelId) {
        await apiRequest(`/imoveis/${editingImovelId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/imoveis', { method: 'POST', body: JSON.stringify(payload) });
      }
      resetImovelForm();
      await loadAll();
      setMessage(ui.saved);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleAluguelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = aluguelSchema.parse(aluguelForm);
      if (editingAluguelId) {
        await apiRequest(`/alugueis/${editingAluguelId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/alugueis', { method: 'POST', body: JSON.stringify(payload) });
      }
      resetAluguelForm();
      await loadAll();
      setMessage(ui.saved);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(path: string) {
    if (!window.confirm(ui.confirmDelete)) {
      return;
    }

    setBusy(true);
    try {
      await apiRequest(path, { method: 'DELETE' });
      await loadAll();
      setMessage(ui.deleted);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function resetPessoaForm() {
    setEditingPessoaId(null);
    setPessoaForm(emptyPessoaForm);
  }

  function resetImovelForm() {
    setEditingImovelId(null);
    setImovelForm(emptyImovelForm);
  }

  function resetAluguelForm() {
    setEditingAluguelId(null);
    setAluguelForm(emptyAluguelForm);
  }

  return (
    <div className="app-root" style={{ ['--font-scale' as string]: String(fontScale) }}>
      <a className="skip-link" href="#main-content">
        {text.skipToContent}
      </a>

      <div className="shell">
        <aside className="sidebar" aria-label="Primary navigation">
          <div>
            <p className="eyebrow">Implementacao real</p>
            <h1>{text.appTitle}</h1>
            <p className="muted">{loading ? ui.loading : 'API e banco conectados por ambiente.'}</p>
          </div>

          <nav className="nav" aria-label="Main sections">
            <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
              {text.dashboard}
            </button>
            <button className={view === 'pessoas' ? 'active' : ''} onClick={() => setView('pessoas')}>
              {text.people}
            </button>
            <button className={view === 'imoveis' ? 'active' : ''} onClick={() => setView('imoveis')}>
              {text.properties}
            </button>
            <button className={view === 'alugueis' ? 'active' : ''} onClick={() => setView('alugueis')}>
              {text.rentals}
            </button>
          </nav>

          <div className="assistive-note" aria-live="polite">
            <strong>{text.accessibilityBar}</strong>
            <p>{message || text.focusStatus}</p>
          </div>
        </aside>

        <main className="content" id="main-content">
          <header className="page-header">
            <div>
              <p className="eyebrow">{text.heroTag}</p>
              <h2>{text.heroTitle}</h2>
              <p className="muted">{text.themeNote}</p>
            </div>

            <div className="header-actions">
              <div className="toolbar-group" role="group" aria-label={text.fontSize}>
                <span className="toolbar-label">A</span>
                <button aria-label={text.decreaseFont} onClick={() => setFontScaleIndex((value) => Math.max(0, value - 1))}>A-</button>
                <button aria-label={text.resetFont} onClick={() => setFontScaleIndex(1)}>A</button>
                <button aria-label={text.increaseFont} onClick={() => setFontScaleIndex((value) => Math.min(fontScales.length - 1, value + 1))}>A+</button>
              </div>

              <div className="toolbar-group" role="group" aria-label={text.language}>
                <span className="toolbar-label">Globe</span>
                {locales.map((item) => (
                  <button key={item} className={item === locale ? 'selected' : ''} aria-pressed={item === locale} onClick={() => setLocale(item)}>
                    {localeNames[item]}
                  </button>
                ))}
              </div>

              <div className="pill">{text.stackReady}</div>
            </div>
          </header>

          {view === 'dashboard' && (
            <section>
              <div className="grid cards">
                <StatCard label={text.peopleCount} value={String(dashboard.pessoas)} />
                <StatCard label={text.propertiesCount} value={String(dashboard.imoveis)} />
                <StatCard label={text.rentalsCount} value={String(dashboard.alugueis)} />
                <StatCard label={text.averageIncome} value={formatCurrency(dashboard.rendaMedia, locale)} />
              </div>
              <div className="panel">
                <h3>{text.mvpScope}</h3>
                <ul>
                  <li>CRUD persistente de pessoas, imoveis e alugueis</li>
                  <li>Banco PostgreSQL/Supabase</li>
                  <li>Deploy preparado para VPS</li>
                  <li>Tema dark, traducoes e acessibilidade</li>
                </ul>
              </div>
            </section>
          )}

          {view === 'pessoas' && (
            <section className="crud-layout">
              <form className="panel form-panel" onSubmit={handlePessoaSubmit}>
                <div className="panel-header"><h3>{text.people}</h3><button type="button" onClick={resetPessoaForm}>{ui.clear}</button></div>
                <div className="form-grid two-columns">
                  <Field label="Nome"><input value={pessoaForm.nome} onChange={(e) => setPessoaForm({ ...pessoaForm, nome: e.target.value })} /></Field>
                  <Field label="Documento fiscal"><input value={pessoaForm.documentoFiscal} onChange={(e) => setPessoaForm({ ...pessoaForm, documentoFiscal: e.target.value })} /></Field>
                  <Field label="Identidade"><input value={pessoaForm.identidade} onChange={(e) => setPessoaForm({ ...pessoaForm, identidade: e.target.value })} /></Field>
                  <Field label="Data de nascimento"><input type="date" value={pessoaForm.dataNascimento} onChange={(e) => setPessoaForm({ ...pessoaForm, dataNascimento: e.target.value })} /></Field>
                  <Field label="Cidade de nascimento"><input value={pessoaForm.cidadeNascimento} onChange={(e) => setPessoaForm({ ...pessoaForm, cidadeNascimento: e.target.value })} /></Field>
                  <Field label="Pais"><input value={pessoaForm.pais} onChange={(e) => setPessoaForm({ ...pessoaForm, pais: e.target.value })} /></Field>
                  <Field label="Profissao"><input value={pessoaForm.profissao} onChange={(e) => setPessoaForm({ ...pessoaForm, profissao: e.target.value })} /></Field>
                  <Field label="Renda"><input type="number" min="0" step="0.01" value={pessoaForm.renda} onChange={(e) => setPessoaForm({ ...pessoaForm, renda: Number(e.target.value) })} /></Field>
                  <Field label="Tipo de logradouro"><select value={pessoaForm.tipoLogradouro} onChange={(e) => setPessoaForm({ ...pessoaForm, tipoLogradouro: e.target.value as PessoaInput['tipoLogradouro'] })}>{tipoLogradouroOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Logradouro"><input value={pessoaForm.logradouro} onChange={(e) => setPessoaForm({ ...pessoaForm, logradouro: e.target.value })} /></Field>
                  <Field label="Numero"><input value={pessoaForm.numero} onChange={(e) => setPessoaForm({ ...pessoaForm, numero: e.target.value })} /></Field>
                  <Field label="Complemento"><input value={pessoaForm.complemento} onChange={(e) => setPessoaForm({ ...pessoaForm, complemento: e.target.value })} /></Field>
                  <Field label="Bairro"><input value={pessoaForm.bairro} onChange={(e) => setPessoaForm({ ...pessoaForm, bairro: e.target.value })} /></Field>
                  <Field label="Cidade"><input value={pessoaForm.cidade} onChange={(e) => setPessoaForm({ ...pessoaForm, cidade: e.target.value })} /></Field>
                  <Field label="Estado"><input value={pessoaForm.estado} onChange={(e) => setPessoaForm({ ...pessoaForm, estado: e.target.value })} /></Field>
                  <Field label="CEP"><input value={pessoaForm.cep} onChange={(e) => setPessoaForm({ ...pessoaForm, cep: e.target.value })} /></Field>
                </div>
                <Field label="Papeis">
                  <div className="checkbox-row">
                    {papelPessoaOptions.map((papel) => (
                      <label key={papel} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={pessoaForm.papeis.includes(papel)}
                          onChange={() => setPessoaForm({ ...pessoaForm, papeis: toggleValue(pessoaForm.papeis, papel) })}
                        />
                        <span>{papel}</span>
                      </label>
                    ))}
                  </div>
                </Field>
                <div className="form-actions">
                  <button disabled={busy} type="submit">{editingPessoaId ? ui.update : ui.create}</button>
                </div>
              </form>

              <div className="panel table-panel">
                <div className="panel-header"><h3>{ui.list}</h3><span className="muted">{pessoas.length} registros</span></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>{text.code}</th><th>{text.name}</th><th>{text.roles}</th><th>{text.document}</th><th>Acoes</th></tr></thead>
                    <tbody>
                      {pessoas.map((pessoa) => (
                        <tr key={pessoa.id}>
                          <td>{pessoa.codigo}</td>
                          <td>{pessoa.nome}</td>
                          <td>{pessoa.papeis.join(', ')}</td>
                          <td>{pessoa.documentoFiscal}</td>
                          <td className="action-cell">
                            <button type="button" onClick={() => { setEditingPessoaId(pessoa.id); setPessoaForm(stripPessoa(pessoa)); }}>{ui.edit}</button>
                            <button type="button" onClick={() => void handleDelete(`/pessoas/${pessoa.id}`)}>{ui.delete}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {view === 'imoveis' && (
            <section className="crud-layout">
              <form className="panel form-panel" onSubmit={handleImovelSubmit}>
                <div className="panel-header"><h3>{text.properties}</h3><button type="button" onClick={resetImovelForm}>{ui.clear}</button></div>
                <div className="form-grid two-columns">
                  <Field label="Descricao breve"><input value={imovelForm.descricaoBreve} onChange={(e) => setImovelForm({ ...imovelForm, descricaoBreve: e.target.value })} /></Field>
                  <Field label="Bairro ou localidade"><input value={imovelForm.bairroLocalidade} onChange={(e) => setImovelForm({ ...imovelForm, bairroLocalidade: e.target.value })} /></Field>
                  <Field label="Descricao detalhada" className="full-width"><textarea value={imovelForm.descricaoDetalhada} onChange={(e) => setImovelForm({ ...imovelForm, descricaoDetalhada: e.target.value })} rows={4} /></Field>
                  <Field label="Valor do aluguel"><input type="number" min="0" step="0.01" value={imovelForm.valorAluguel} onChange={(e) => setImovelForm({ ...imovelForm, valorAluguel: Number(e.target.value) })} /></Field>
                  <Field label="Moeda"><input value={imovelForm.moeda} onChange={(e) => setImovelForm({ ...imovelForm, moeda: e.target.value })} /></Field>
                  <Field label="URL do anuncio"><input value={imovelForm.urlAnuncio} onChange={(e) => setImovelForm({ ...imovelForm, urlAnuncio: e.target.value })} /></Field>
                  <Field label="Numero de quartos"><input type="number" min="0" value={imovelForm.numeroQuartos} onChange={(e) => setImovelForm({ ...imovelForm, numeroQuartos: Number(e.target.value) })} /></Field>
                  <Field label="Tipo de quarto"><select value={imovelForm.tipoQuarto} onChange={(e) => setImovelForm({ ...imovelForm, tipoQuarto: e.target.value as ImovelInput['tipoQuarto'] })}>{tipoQuartoOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Metros quadrados"><input type="number" min="0" step="0.01" value={imovelForm.metrosQuadradosConstruidos} onChange={(e) => setImovelForm({ ...imovelForm, metrosQuadradosConstruidos: Number(e.target.value) })} /></Field>
                  <Field label="Tipo de imovel"><select value={imovelForm.tipoImovel} onChange={(e) => setImovelForm({ ...imovelForm, tipoImovel: e.target.value as ImovelInput['tipoImovel'] })}>{tipoImovelOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Lavanderia"><select value={imovelForm.tipoLavanderia} onChange={(e) => setImovelForm({ ...imovelForm, tipoLavanderia: e.target.value as ImovelInput['tipoLavanderia'] })}>{tipoLavanderiaOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Cozinha"><select value={imovelForm.tipoCozinha} onChange={(e) => setImovelForm({ ...imovelForm, tipoCozinha: e.target.value as ImovelInput['tipoCozinha'] })}>{tipoCozinhaOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Area gourmet"><select value={imovelForm.areaGourmetTipo} onChange={(e) => setImovelForm({ ...imovelForm, areaGourmetTipo: e.target.value as ImovelInput['areaGourmetTipo'] })}>{areaGourmetTipoOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
                  <Field label="Area gourmet m2"><input type="number" min="0" step="0.01" value={imovelForm.areaGourmetMetrosQuadrados} onChange={(e) => setImovelForm({ ...imovelForm, areaGourmetMetrosQuadrados: Number(e.target.value) })} /></Field>
                </div>
                <Field label="Proprietarios">
                  <div className="checkbox-row">
                    {pessoas.filter((pessoa) => pessoa.papeis.includes('proprietario')).map((pessoa) => (
                      <label key={pessoa.id} className="checkbox-item">
                        <input type="checkbox" checked={imovelForm.proprietarioIds.includes(pessoa.id)} onChange={() => setImovelForm({ ...imovelForm, proprietarioIds: toggleValue(imovelForm.proprietarioIds, pessoa.id) })} />
                        <span>{pessoa.nome}</span>
                      </label>
                    ))}
                  </div>
                </Field>
                <div className="form-actions"><button disabled={busy} type="submit">{editingImovelId ? ui.update : ui.create}</button></div>
              </form>

              <div className="panel table-panel">
                <div className="panel-header"><h3>{ui.list}</h3><span className="muted">{imoveis.length} registros</span></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>{text.code}</th><th>Descricao</th><th>{text.rent}</th><th>{text.owners}</th><th>Acoes</th></tr></thead>
                    <tbody>
                      {imoveis.map((imovel) => (
                        <tr key={imovel.id}>
                          <td>{imovel.codigo}</td>
                          <td>{imovel.descricaoBreve}</td>
                          <td>{formatCurrency(imovel.valorAluguel, locale)}</td>
                          <td>{imovel.proprietarioIds.map((id) => pessoas.find((item) => item.id === id)?.nome ?? '-').join(', ')}</td>
                          <td className="action-cell">
                            <button type="button" onClick={() => { setEditingImovelId(imovel.id); setImovelForm(stripImovel(imovel)); }}>{ui.edit}</button>
                            <button type="button" onClick={() => void handleDelete(`/imoveis/${imovel.id}`)}>{ui.delete}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {view === 'alugueis' && (
            <section className="crud-layout">
              <form className="panel form-panel" onSubmit={handleAluguelSubmit}>
                <div className="panel-header"><h3>{text.rentals}</h3><button type="button" onClick={resetAluguelForm}>{ui.clear}</button></div>
                <div className="form-grid two-columns">
                  <Field label="Imovel"><select value={aluguelForm.imovelId} onChange={(e) => setAluguelForm({ ...aluguelForm, imovelId: e.target.value })}><option value="">Selecione</option>{imoveis.map((item) => <option key={item.id} value={item.id}>{item.codigo} - {item.descricaoBreve}</option>)}</select></Field>
                  <Field label="Locador"><select value={aluguelForm.locadorId} onChange={(e) => setAluguelForm({ ...aluguelForm, locadorId: e.target.value })}><option value="">Selecione</option>{pessoas.filter((item) => item.papeis.includes('locador')).map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></Field>
                  <Field label="Locatario"><select value={aluguelForm.locatarioId} onChange={(e) => setAluguelForm({ ...aluguelForm, locatarioId: e.target.value })}><option value="">Selecione</option>{pessoas.filter((item) => item.papeis.includes('locatario')).map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></Field>
                  <Field label="Valor acordado"><input type="number" min="0" step="0.01" value={aluguelForm.valorAcordadoAluguel} onChange={(e) => setAluguelForm({ ...aluguelForm, valorAcordadoAluguel: Number(e.target.value) })} /></Field>
                  <Field label="Data de inicio"><input type="date" value={aluguelForm.dataInicio} onChange={(e) => setAluguelForm({ ...aluguelForm, dataInicio: e.target.value })} /></Field>
                  <Field label="Data final"><input type="date" value={aluguelForm.dataFim} onChange={(e) => setAluguelForm({ ...aluguelForm, dataFim: e.target.value })} /></Field>
                  <Field label="Indice de reajuste"><input value={aluguelForm.indiceReajuste} onChange={(e) => setAluguelForm({ ...aluguelForm, indiceReajuste: e.target.value })} /></Field>
                  <Field label="Percentual de reajuste"><input type="number" min="0" step="0.01" value={aluguelForm.percentualReajuste} onChange={(e) => setAluguelForm({ ...aluguelForm, percentualReajuste: Number(e.target.value) })} /></Field>
                  <Field label="Clausula de extensao" className="full-width"><textarea rows={4} value={aluguelForm.clausulaExtensaoAposPrazoOriginal} onChange={(e) => setAluguelForm({ ...aluguelForm, clausulaExtensaoAposPrazoOriginal: e.target.value })} /></Field>
                </div>
                <div className="periodos-header">
                  <h4>Periodos anuais</h4>
                  <button type="button" onClick={() => setAluguelForm({ ...aluguelForm, periodos: [...aluguelForm.periodos, emptyPeriodo(aluguelForm.periodos.length + 1)] })}>{ui.addPeriod}</button>
                </div>
                <div className="stack">
                  {aluguelForm.periodos.map((periodo, index) => (
                    <div className="period-card" key={`${periodo.periodo}-${index}`}>
                      <div className="panel-header"><strong>Periodo {periodo.periodo}</strong><button type="button" onClick={() => setAluguelForm({ ...aluguelForm, periodos: aluguelForm.periodos.filter((_, itemIndex) => itemIndex !== index).map((item, seq) => ({ ...item, periodo: seq + 1 })) })}>{ui.remove}</button></div>
                      <div className="form-grid two-columns">
                        <Field label="Inicio"><input type="date" value={periodo.dataInicioPeriodo} onChange={(e) => updatePeriodo(index, 'dataInicioPeriodo', e.target.value)} /></Field>
                        <Field label="Fim"><input type="date" value={periodo.dataFimPeriodo} onChange={(e) => updatePeriodo(index, 'dataFimPeriodo', e.target.value)} /></Field>
                        <Field label="Valor"><input type="number" min="0" step="0.01" value={periodo.valorAcordadoAluguel} onChange={(e) => updatePeriodo(index, 'valorAcordadoAluguel', Number(e.target.value))} /></Field>
                        <Field label="Indice"><input value={periodo.indiceReajuste} onChange={(e) => updatePeriodo(index, 'indiceReajuste', e.target.value)} /></Field>
                        <Field label="Percentual"><input type="number" min="0" step="0.01" value={periodo.percentualReajuste} onChange={(e) => updatePeriodo(index, 'percentualReajuste', Number(e.target.value))} /></Field>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-actions"><button disabled={busy} type="submit">{editingAluguelId ? ui.update : ui.create}</button></div>
              </form>

              <div className="panel table-panel">
                <div className="panel-header"><h3>{ui.list}</h3><span className="muted">{alugueis.length} registros</span></div>
                <div className="stack">
                  {alugueis.map((aluguel) => (
                    <article key={aluguel.id} className="rental-card compact-card">
                      <div className="panel-header">
                        <div>
                          <p className="eyebrow">{aluguel.codigo}</p>
                          <h4>{imoveis.find((item) => item.id === aluguel.imovelId)?.descricaoBreve ?? aluguel.codigo}</h4>
                        </div>
                        <span className="pill">{formatCurrency(aluguel.valorAcordadoAluguel, locale)}</span>
                      </div>
                      <div className="grid rental-meta">
                        <Metric label={text.landlord} value={pessoas.find((item) => item.id === aluguel.locadorId)?.nome ?? '-'} />
                        <Metric label={text.tenant} value={pessoas.find((item) => item.id === aluguel.locatarioId)?.nome ?? '-'} />
                        <Metric label={text.start} value={aluguel.dataInicio} />
                        <Metric label={text.end} value={aluguel.dataFim} />
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>Periodo</th><th>Inicio</th><th>Fim</th><th>Indice</th><th>%</th><th>Valor</th></tr></thead>
                          <tbody>
                            {aluguel.periodos.map((periodo) => (
                              <tr key={periodo.id}><td>{periodo.periodo}</td><td>{periodo.dataInicioPeriodo}</td><td>{periodo.dataFimPeriodo}</td><td>{periodo.indiceReajuste}</td><td>{periodo.percentualReajuste}</td><td>{formatCurrency(periodo.valorAcordadoAluguel, locale)}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="action-row">
                        <button type="button" onClick={() => { setEditingAluguelId(aluguel.id); setAluguelForm(stripAluguel(aluguel)); }}>{ui.edit}</button>
                        <button type="button" onClick={() => void handleDelete(`/alugueis/${aluguel.id}`)}>{ui.delete}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );

  function updatePeriodo<K extends keyof AluguelPeriodoInput>(index: number, key: K, value: AluguelPeriodoInput[K]) {
    setAluguelForm({
      ...aluguelForm,
      periodos: aluguelForm.periodos.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    });
  }
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`field ${className ?? ''}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function stripPessoa(pessoa: Pessoa): PessoaInput {
  return { ...pessoa };
}

function stripImovel(imovel: Imovel): ImovelInput {
  return { ...imovel, urlAnuncio: imovel.urlAnuncio ?? '', areaGourmetMetrosQuadrados: imovel.areaGourmetMetrosQuadrados ?? 0 };
}

function stripAluguel(aluguel: Aluguel): AluguelInput {
  return {
    imovelId: aluguel.imovelId,
    locadorId: aluguel.locadorId,
    locatarioId: aluguel.locatarioId,
    dataInicio: aluguel.dataInicio,
    dataFim: aluguel.dataFim,
    clausulaExtensaoAposPrazoOriginal: aluguel.clausulaExtensaoAposPrazoOriginal,
    valorAcordadoAluguel: aluguel.valorAcordadoAluguel,
    indiceReajuste: aluguel.indiceReajuste,
    percentualReajuste: aluguel.percentualReajuste,
    periodos: aluguel.periodos.map((periodo) => ({ ...periodo })),
  };
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as { message?: string; details?: string[] } | T;
  if (!response.ok) {
    const errorBody = body as { message?: string; details?: string[] };
    throw new Error(errorBody.details?.join(', ') || errorBody.message || 'Erro na requisicao');
  }

  return body as T;
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Erro inesperado';
}

function uiText(locale: Locale) {
  const labels: Record<Locale, { create: string; update: string; delete: string; edit: string; clear: string; addPeriod: string; remove: string; saved: string; deleted: string; confirmDelete: string; list: string; loading: string }> = {
    'pt-BR': { create: 'Salvar', update: 'Atualizar', delete: 'Excluir', edit: 'Editar', clear: 'Limpar', addPeriod: 'Adicionar periodo', remove: 'Remover', saved: 'Registro salvo com sucesso', deleted: 'Registro removido com sucesso', confirmDelete: 'Deseja realmente excluir este registro?', list: 'Registros', loading: 'Carregando dados...' },
    en: { create: 'Save', update: 'Update', delete: 'Delete', edit: 'Edit', clear: 'Clear', addPeriod: 'Add term', remove: 'Remove', saved: 'Record saved successfully', deleted: 'Record removed successfully', confirmDelete: 'Do you really want to delete this record?', list: 'Records', loading: 'Loading data...' },
    'es-PY': { create: 'Guardar', update: 'Actualizar', delete: 'Eliminar', edit: 'Editar', clear: 'Limpiar', addPeriod: 'Agregar periodo', remove: 'Quitar', saved: 'Registro guardado con exito', deleted: 'Registro eliminado con exito', confirmDelete: 'Desea eliminar este registro?', list: 'Registros', loading: 'Cargando datos...' },
    gn: { create: 'Ñongatu', update: 'Mbohekopyahu', delete: 'Juka', edit: 'Editar', clear: 'Mopotĩ', addPeriod: 'Embojuaju periodo', remove: 'Eipea', saved: 'Registro oñeñongatu porã', deleted: 'Registro oñembogue porã', confirmDelete: 'Reipease piko ko registro?', list: 'Registros', loading: 'Oñemyanyhẽhína datos...' },
    de: { create: 'Speichern', update: 'Aktualisieren', delete: 'Loeschen', edit: 'Bearbeiten', clear: 'Leeren', addPeriod: 'Periode hinzufuegen', remove: 'Entfernen', saved: 'Eintrag erfolgreich gespeichert', deleted: 'Eintrag erfolgreich geloescht', confirmDelete: 'Soll dieser Eintrag wirklich geloescht werden?', list: 'Eintraege', loading: 'Daten werden geladen...' },
  };

  return labels[locale];
}
