import {
  ATIVIDADES_INICIAIS,
  COLABORADORES_PADRAO,
  METAS_ATIVIDADES_PADRAO
} from '../data/mockData';
import {
  AtividadeOperacional,
  CargoColaborador,
  Colaborador,
  MetaAtividade,
  StatusMeta
} from '../types/wms';
import {
  avaliarProdutividade,
  calcularTempoMinutos,
  formatarTempoMinutos,
  getCarimboFormatado,
  getDataHojeISO,
  getDiaSemana,
  getHoraAtual,
  getNumeroSemana
} from '../utils/wmsCalculations';

const STORAGE_KEYS = {
  ATIVIDADES: 'wms_cd_mt_trevo_atividades_v2',
  COLABORADORES: 'wms_cd_mt_trevo_colaboradores_v2',
  METAS: 'wms_cd_mt_trevo_metas_v2',
  USUARIO_LOGADO: 'wms_cd_mt_trevo_usuario_ativo_v2'
};

export const wmsStorage = {
  getAtividades(): AtividadeOperacional[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATIVIDADES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ATIVIDADES, JSON.stringify(ATIVIDADES_INICIAIS));
        return ATIVIDADES_INICIAIS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Erro ao ler atividades:', e);
      return ATIVIDADES_INICIAIS;
    }
  },

  saveAtividades(atividades: AtividadeOperacional[]) {
    localStorage.setItem(STORAGE_KEYS.ATIVIDADES, JSON.stringify(atividades));
  },

  getColaboradores(): Colaborador[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLABORADORES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.COLABORADORES, JSON.stringify(COLABORADORES_PADRAO));
        return COLABORADORES_PADRAO;
      }
      return JSON.parse(data);
    } catch (e) {
      return COLABORADORES_PADRAO;
    }
  },

  saveColaboradores(colabs: Colaborador[]) {
    localStorage.setItem(STORAGE_KEYS.COLABORADORES, JSON.stringify(colabs));
  },

  getMetas(): MetaAtividade[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.METAS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.METAS, JSON.stringify(METAS_ATIVIDADES_PADRAO));
        return METAS_ATIVIDADES_PADRAO;
      }
      return JSON.parse(data);
    } catch (e) {
      return METAS_ATIVIDADES_PADRAO;
    }
  },

  saveMetas(metas: MetaAtividade[]) {
    localStorage.setItem(STORAGE_KEYS.METAS, JSON.stringify(metas));
  },

  /**
   * O Analista cria e despacha uma nova demanda para um Auxiliar ou Assistente
   */
  criarDespachoAnalista(params: {
    nomeCompleto: string;
    cargo: CargoColaborador;
    equipe: string;
    setor: string;
    atividade: string;
    itensPrevistos: number;
    rua: string;
    observacao?: string;
    prioridade?: 'Normal' | 'Urgente' | 'Alta';
    analistaCriador: string;
  }): AtividadeOperacional {
    const hojeStr = getDataHojeISO();
    const horaAgora = getHoraAtual();
    const carimbo = getCarimboFormatado();
    const metas = this.getMetas();
    const metaObj = metas.find(m => m.atividade === params.atividade);
    const metaHora = metaObj ? metaObj.itensPorHora : 140;

    const nova: AtividadeOperacional = {
      id: `atv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      carimboDataHora: carimbo,
      nomeCompleto: params.nomeCompleto,
      cargo: params.cargo,
      equipe: params.equipe,
      setor: params.setor,
      atividade: params.atividade,
      itens: 0,
      itensPrevistos: params.itensPrevistos || 0,
      rua: params.rua,
      observacao: params.observacao || '',
      horaInicio: '',
      horaFim: '',
      data: hojeStr,
      diaSemana: getDiaSemana(hojeStr),
      semana: getNumeroSemana(hojeStr),
      ano: new Date().getFullYear(),
      tempoFormatado: 'Não iniciado',
      tempoExecucaoMinutos: 0,
      metaCalculada: params.itensPrevistos || metaHora,
      statusMeta: 'Atingiu a Meta',
      itensPorHora: 0,
      status: 'Pendente',
      analistaCriador: params.analistaCriador || 'Analista WMS',
      horaDespacho: horaAgora,
      tempoRetornoMinutos: 0,
      tempoRetornoFormatado: 'Aguardando Início',
      prioridade: params.prioridade || 'Normal'
    };

    const lista = this.getAtividades();
    const atualizada = [nova, ...lista];
    this.saveAtividades(atualizada);
    return nova;
  },

  /**
   * Auxiliar ou Assistente dá o Início na atividade pelo celular / coletor
   */
  iniciarAtividadeMobile(id: string): AtividadeOperacional | null {
    const lista = this.getAtividades();
    const index = lista.findIndex(a => a.id === id);
    if (index === -1) return null;

    const horaAgora = getHoraAtual();
    const item = { ...lista[index] };
    item.status = 'Em Andamento';
    item.horaInicio = horaAgora;
    item.tempoFormatado = 'Em execução';
    item.tempoRetornoFormatado = 'Em execução';

    lista[index] = item;
    this.saveAtividades(lista);
    return item;
  },

  /**
   * Auxiliar ou Assistente dá o Retorno / Finaliza a atividade pelo celular
   */
  retornarAtividadeMobile(params: {
    id: string;
    itens: number;
    rua?: string;
    observacao?: string;
  }): AtividadeOperacional | null {
    const lista = this.getAtividades();
    const index = lista.findIndex(a => a.id === params.id);
    if (index === -1) return null;

    const item = { ...lista[index] };
    const horaAgora = getHoraAtual();
    const horaInicio = item.horaInicio || horaAgora;

    item.horaFim = horaAgora;
    item.horaRetorno = horaAgora;
    item.itens = params.itens;
    if (params.rua) item.rua = params.rua;
    if (params.observacao) {
      item.observacao = item.observacao ? `${item.observacao} | Retorno: ${params.observacao}` : params.observacao;
    }

    // Calcula tempo de execução
    const duracaoExecucao = Math.max(1, calcularTempoMinutos(horaInicio, horaAgora));
    item.tempoExecucaoMinutos = duracaoExecucao;
    item.tempoFormatado = formatarTempoMinutos(duracaoExecucao);

    // Calcula tempo de retorno total (desde despacho do analista até o retorno)
    const tempoRetorno = item.horaDespacho ? Math.max(1, calcularTempoMinutos(item.horaDespacho, horaAgora)) : duracaoExecucao;
    item.tempoRetornoMinutos = tempoRetorno;
    item.tempoRetornoFormatado = formatarTempoMinutos(tempoRetorno);

    // Avalia meta
    const metas = this.getMetas();
    const metaObj = metas.find(m => m.atividade === item.atividade);
    const metaHora = metaObj ? metaObj.itensPorHora : 140;

    const avaliacao = avaliarProdutividade(item.itens, duracaoExecucao, metaHora);
    item.metaCalculada = avaliacao.metaCalculada;
    item.itensPorHora = avaliacao.itensPorHora;
    item.statusMeta = avaliacao.statusMeta;
    item.status = 'Concluído';
    item.carimboDataHora = getCarimboFormatado();

    lista[index] = item;
    this.saveAtividades(lista);
    return item;
  },

  /**
   * Lançamento direto manual (compatível com o antigo Google Forms)
   */
  adicionarLancamentoManual(dados: {
    nomeCompleto: string;
    cargo: CargoColaborador;
    equipe: string;
    setor: string;
    atividade: string;
    itens: number;
    rua: string;
    observacao?: string;
    horaInicio: string;
    horaFim: string;
    data: string;
    analistaCriador?: string;
  }): AtividadeOperacional {
    const duracaoMinutos = calcularTempoMinutos(dados.horaInicio, dados.horaFim);
    const metas = this.getMetas();
    const metaObj = metas.find(m => m.atividade === dados.atividade);
    const metaHora = metaObj ? metaObj.itensPorHora : 140;

    const avaliacao = avaliarProdutividade(dados.itens, duracaoMinutos, metaHora);
    const carimbo = getCarimboFormatado();
    const diaSemana = getDiaSemana(dados.data);
    const semana = getNumeroSemana(dados.data);
    const ano = parseInt(dados.data.split('-')[0]) || new Date().getFullYear();

    const novo: AtividadeOperacional = {
      id: `atv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      carimboDataHora: carimbo,
      nomeCompleto: dados.nomeCompleto,
      cargo: dados.cargo,
      equipe: dados.equipe,
      setor: dados.setor,
      atividade: dados.atividade,
      itens: dados.itens,
      itensPrevistos: dados.itens,
      rua: dados.rua,
      observacao: dados.observacao || '',
      horaInicio: dados.horaInicio,
      horaFim: dados.horaFim,
      data: dados.data,
      diaSemana,
      semana,
      ano,
      tempoFormatado: formatarTempoMinutos(duracaoMinutos),
      tempoExecucaoMinutos: duracaoMinutos,
      metaCalculada: avaliacao.metaCalculada,
      statusMeta: avaliacao.statusMeta,
      itensPorHora: avaliacao.itensPorHora,
      status: 'Concluído',
      analistaCriador: dados.analistaCriador || 'Lançamento Manual',
      horaDespacho: dados.horaInicio,
      horaRetorno: dados.horaFim,
      tempoRetornoMinutos: duracaoMinutos,
      tempoRetornoFormatado: formatarTempoMinutos(duracaoMinutos),
      prioridade: 'Normal'
    };

    const lista = this.getAtividades();
    this.saveAtividades([novo, ...lista]);
    return novo;
  },

  excluirAtividade(id: string) {
    const lista = this.getAtividades().filter(a => a.id !== id);
    this.saveAtividades(lista);
  },

  atualizarAtividade(id: string, updates: Partial<AtividadeOperacional>) {
    const lista = this.getAtividades();
    const idx = lista.findIndex(a => a.id === id);
    if (idx !== -1) {
      lista[idx] = { ...lista[idx], ...updates };
      this.saveAtividades(lista);
    }
  },

  resetarBasePadrao() {
    localStorage.setItem(STORAGE_KEYS.ATIVIDADES, JSON.stringify(ATIVIDADES_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.COLABORADORES, JSON.stringify(COLABORADORES_PADRAO));
    localStorage.setItem(STORAGE_KEYS.METAS, JSON.stringify(METAS_ATIVIDADES_PADRAO));
  },

  /**
   * Gera CSV exatamente compatível com o Google Forms / Google Sheets original da Perlog
   */
  exportarParaCSV(atividades: AtividadeOperacional[]): string {
    // Cabeçalho idêntico à base do usuário + colunas ricas de controle
    const headers = [
      'Carimbo de data/hora',
      'Nome Completo',
      'Cargo',
      'Equipe',
      'Setor',
      'Atividades Realizadas',
      'Itens',
      'Rua (Check)',
      'Observação',
      'Hora Inicio',
      'Hora Fim',
      'Data',
      'Dia da Semana',
      'Semana',
      'Ano',
      'Tempo',
      'META',
      'STATUS META',
      'Status Operacional',
      'Analista Despacho',
      'Hora Despacho',
      'Hora Retorno',
      'Tempo Retorno (min)',
      'Itens Por Hora'
    ];

    const escapeCsv = (str: string | number | undefined) => {
      if (str === undefined || str === null) return '';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = atividades.map(a => [
      escapeCsv(a.carimboDataHora),
      escapeCsv(a.nomeCompleto),
      escapeCsv(a.cargo),
      escapeCsv(a.equipe),
      escapeCsv(a.setor),
      escapeCsv(a.atividade),
      a.itens || 0,
      escapeCsv(a.rua),
      escapeCsv(a.observacao || ''),
      escapeCsv(a.horaInicio),
      escapeCsv(a.horaFim),
      escapeCsv(a.data),
      escapeCsv(a.diaSemana),
      a.semana || '',
      a.ano || '',
      escapeCsv(a.tempoFormatado),
      a.metaCalculada || '',
      escapeCsv(a.statusMeta),
      escapeCsv(a.status),
      escapeCsv(a.analistaCriador),
      escapeCsv(a.horaDespacho),
      escapeCsv(a.horaRetorno || ''),
      a.tempoRetornoMinutos || '',
      a.itensPorHora || ''
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  },

  /**
   * Importa CSV simples para a base
   */
  importarCSV(csvText: string): number {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return 0;

    let importados = 0;
    const novas: AtividadeOperacional[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Suporta vírgula simples ou vírgula com aspas
      const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols.length < 5) continue;

      const nomeCompleto = cols[1] || `Colaborador ${i}`;
      const equipe = cols[2] || 'Equipe A (Manhã)';
      const setor = cols[3] || 'Separação';
      const atividade = cols[4] || 'Separação de Pedidos';
      const itens = parseInt(cols[5]) || 0;
      const rua = cols[6] || 'Rua 01';
      const observacao = cols[7] || '';
      const horaInicio = cols[8] || '08:00';
      const horaFim = cols[9] || '09:00';
      const data = cols[10] || getDataHojeISO();

      const duracao = calcularTempoMinutos(horaInicio, horaFim);
      const avaliacao = avaliarProdutividade(itens, duracao, 140);

      novas.push({
        id: `import-${Date.now()}-${i}`,
        carimboDataHora: cols[0] || getCarimboFormatado(),
        nomeCompleto,
        cargo: nomeCompleto.toLowerCase().includes('assistente') ? 'Assistente' : 'Auxiliar',
        equipe,
        setor,
        atividade,
        itens,
        itensPrevistos: itens,
        rua,
        observacao,
        horaInicio,
        horaFim,
        data,
        diaSemana: getDiaSemana(data),
        semana: getNumeroSemana(data),
        ano: new Date().getFullYear(),
        tempoFormatado: formatarTempoMinutos(duracao),
        tempoExecucaoMinutos: duracao,
        metaCalculada: avaliacao.metaCalculada,
        statusMeta: avaliacao.statusMeta,
        itensPorHora: avaliacao.itensPorHora,
        status: 'Concluído',
        analistaCriador: 'Importação CSV',
        horaDespacho: horaInicio,
        horaRetorno: horaFim,
        tempoRetornoMinutos: duracao,
        tempoRetornoFormatado: formatarTempoMinutos(duracao),
        prioridade: 'Normal'
      });
      importados++;
    }

    if (novas.length > 0) {
      const lista = this.getAtividades();
      this.saveAtividades([...novas, ...lista]);
    }

    return importados;
  }
};
