import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Timer,
  ArrowUpRight,
  Filter,
  Warehouse,
  Boxes,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Calendar,
  Star,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';
import { AtividadeOperacional, CargoColaborador } from '../types/wms';
import { formatarTempoMinutos } from '../utils/wmsCalculations';
import { MATRIZ_ROTINA_SEMANAL, getMatrizPorDia, getDiaSemanaAtualNome, SECOES_CD_MT } from '../data/rotinaSemanal';
import { getUrlPainel } from '../utils/painelLinks';
import { Copy, Check } from 'lucide-react';

interface PainelDashboardProps {
  atividades: AtividadeOperacional[];
  onIrParaDespacho: () => void;
  onIrParaMobile: () => void;
  onIrParaRuas?: () => void;
  onVoltarParaHub?: () => void;
  isStandalone?: boolean;
}

export const PainelDashboard: React.FC<PainelDashboardProps> = ({
  atividades,
  onIrParaDespacho,
  onIrParaMobile,
  onIrParaRuas,
  onVoltarParaHub,
  isStandalone = false
}) => {
  const [filtroPeriodo, setFiltroPeriodo] = useState<'hoje' | '7dias' | 'todos'>('hoje');
  const [filtroEquipe, setFiltroEquipe] = useState<string>('todas');
  const [filtroSetor, setFiltroSetor] = useState<string>('todos');
  const [filtroCargo, setFiltroCargo] = useState<string>('todos');
  const [filtroSecao, setFiltroSecao] = useState<string>('todas');
  const [filtroMeta, setFiltroMeta] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  const urlPropria = getUrlPainel('rotinas', true);

  const handleCopiarUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(urlPropria).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  const diaSemanaAtual = getDiaSemanaAtualNome();
  const tarefasHojeRotina = useMemo(() => getMatrizPorDia(diaSemanaAtual), [diaSemanaAtual]);

  // Filtra atividades concluídas para métricas de produtividade
  const atividadesFiltradas = useMemo(() => {
    return atividades.filter(a => {
      if (filtroEquipe !== 'todas' && a.equipe !== filtroEquipe) return false;
      if (filtroSetor !== 'todos' && a.setor !== filtroSetor) return false;
      if (filtroCargo !== 'todos' && a.cargo !== filtroCargo) return false;
      if (filtroSecao !== 'todas' && a.secao !== filtroSecao) return false;
      if (filtroMeta !== 'todos' && a.statusMeta !== filtroMeta) return false;
      if (busca) {
        const b = busca.toLowerCase();
        const matchNome = a.nomeCompleto.toLowerCase().includes(b);
        const matchAtiv = a.atividade.toLowerCase().includes(b);
        const matchRua = a.rua?.toLowerCase().includes(b);
        if (!matchNome && !matchAtiv && !matchRua) return false;
      }
      if (filtroPeriodo === 'hoje') {
        const hojeIso = new Date().toISOString().split('T')[0];
        if (a.data && a.data !== hojeIso) return false;
      }
      return true;
    });
  }, [atividades, filtroPeriodo, filtroEquipe, filtroSetor, filtroCargo, filtroSecao, filtroMeta, busca]);

  const concluidas = useMemo(() => {
    return atividadesFiltradas.filter(a => a.status === 'Concluído');
  }, [atividadesFiltradas]);

  const emAndamento = useMemo(() => {
    return atividades.filter(a => a.status === 'Em Andamento');
  }, [atividades]);

  const pendentes = useMemo(() => {
    return atividades.filter(a => a.status === 'Pendente');
  }, [atividades]);

  // Estatísticas Globais
  const stats = useMemo(() => {
    const totalItens = concluidas.reduce((acc, cur) => acc + (cur.itens || 0), 0);
    const totalMinutosRetorno = concluidas.reduce((acc, cur) => acc + (cur.tempoRetornoMinutos || cur.tempoExecucaoMinutos || 0), 0);
    const tmrGeral = concluidas.length > 0 ? Math.round(totalMinutosRetorno / concluidas.length) : 0;

    // Auxiliares vs Assistentes
    const concluidasAux = concluidas.filter(a => a.cargo === 'Auxiliar');
    const concluidasAss = concluidas.filter(a => a.cargo === 'Assistente');

    const totalMinutosAux = concluidasAux.reduce((acc, cur) => acc + (cur.tempoRetornoMinutos || cur.tempoExecucaoMinutos || 0), 0);
    const tmrAux = concluidasAux.length > 0 ? Math.round(totalMinutosAux / concluidasAux.length) : 0;

    const totalMinutosAss = concluidasAss.reduce((acc, cur) => acc + (cur.tempoRetornoMinutos || cur.tempoExecucaoMinutos || 0), 0);
    const tmrAss = concluidasAss.length > 0 ? Math.round(totalMinutosAss / concluidasAss.length) : 0;

    const itensAux = concluidasAux.reduce((acc, cur) => acc + (cur.itens || 0), 0);
    const itensAss = concluidasAss.reduce((acc, cur) => acc + (cur.itens || 0), 0);

    // Metas
    const acimaMetaCount = concluidas.filter(a => a.statusMeta === 'Acima da Meta').length;
    const atingiuMetaCount = concluidas.filter(a => a.statusMeta === 'Atingiu a Meta').length;
    const abaixoMetaCount = concluidas.filter(a => a.statusMeta === 'Abaixo da Meta').length;
    const taxaSucesso = concluidas.length > 0 ? Math.round(((acimaMetaCount + atingiuMetaCount) / concluidas.length) * 100) : 0;

    return {
      totalItens,
      tmrGeral,
      tmrAux,
      tmrAss,
      itensAux,
      itensAss,
      concluidasCount: concluidas.length,
      acimaMetaCount,
      atingiuMetaCount,
      abaixoMetaCount,
      taxaSucesso
    };
  }, [concluidas]);

  // Ranking individual: "Quem Fez Mais" (Separado por Auxiliar e Assistente)
  const rankingColaboradores = useMemo(() => {
    const mapa = new Map<string, {
      nome: string;
      cargo: CargoColaborador;
      equipe: string;
      totalItens: number;
      totalTarefas: number;
      minutosRetornoTotal: number;
      tmrIndividual: number;
      itensPorHoraMedio: number;
    }>();

    concluidas.forEach(a => {
      const chave = a.nomeCompleto;
      const registro = mapa.get(chave) || {
        nome: a.nomeCompleto,
        cargo: a.cargo || 'Auxiliar',
        equipe: a.equipe || 'Equipe A (Manhã)',
        totalItens: 0,
        totalTarefas: 0,
        minutosRetornoTotal: 0,
        tmrIndividual: 0,
        itensPorHoraMedio: 0
      };

      registro.totalItens += a.itens || 0;
      registro.totalTarefas += 1;
      registro.minutosRetornoTotal += a.tempoRetornoMinutos || a.tempoExecucaoMinutos || 0;

      mapa.set(chave, registro);
    });

    const lista = Array.from(mapa.values()).map(r => ({
      ...r,
      tmrIndividual: r.totalTarefas > 0 ? Math.round(r.minutosRetornoTotal / r.totalTarefas) : 0,
      itensPorHoraMedio: r.totalTarefas > 0 
        ? Math.round(r.totalItens / Math.max(1, r.minutosRetornoTotal / 60))
        : 0
    }));

    // Separa e ordena por quem fez mais itens
    const auxiliares = lista.filter(c => c.cargo === 'Auxiliar').sort((a, b) => b.totalItens - a.totalItens);
    const assistentes = lista.filter(c => c.cargo === 'Assistente').sort((a, b) => b.totalItens - a.totalItens);

    const maxItensAux = auxiliares.length > 0 ? Math.max(...auxiliares.map(a => a.totalItens)) : 1;
    const maxItensAss = assistentes.length > 0 ? Math.max(...assistentes.map(a => a.totalItens)) : 1;

    return {
      auxiliares,
      assistentes,
      maxItensAux,
      maxItensAss
    };
  }, [concluidas]);

  // Volume por Seção Comercial (Líquida, Alimentar, Bazar, Limpeza, Perfumaria, Insumo) igual à imagem anexada
  const volumePorSecao = useMemo(() => {
    const mapa = new Map<string, number>();
    SECOES_CD_MT.forEach(s => mapa.set(s, 0));

    concluidas.forEach(a => {
      const s = a.secao || 'Alimentar';
      mapa.set(s, (mapa.get(s) || 0) + (a.itens || 0));
    });

    const arr = Array.from(mapa.entries()).map(([secao, itens]) => ({ secao, itens }));
    const maxSecao = Math.max(...arr.map(x => x.itens), 1);
    return { arr, maxSecao };
  }, [concluidas]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* BANNER CORPORATIVO ESTILO MT - WMS (IDÊNTICO À IMAGEM ANEXADA) */}
      <div className="bg-gradient-to-r from-[#051336] via-[#0b2259] to-[#040f2b] rounded-2xl p-4 sm:p-6 text-white shadow-md border border-[#0e2c73] relative overflow-hidden">
        {/* Detalhe de fundo tecnológico */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          
          {/* Logo e Título com Ícone Circuit */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner">
              <svg className="w-7 h-7 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" />
                <path d="m4.93 10.93 2.83 2.83" />
                <path d="M2 18h4" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-2.83 2.83" />
                <path d="M22 22H2" />
                <circle cx="12" cy="18" r="4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dashboard WMS
                </h1>
                <span className="text-[11px] font-mono font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                  CD MT TREVO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Acompanhamento Operacional · Despacho do Analista & Retorno da Equipe (Auxiliares e Assistentes)
              </p>
            </div>
          </div>

          {/* Faixa / Badge Estilo "Valor Corte do Mês / Meta Operacional" da Imagem + Botão Abrir Painel */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#030e29]/90 border border-sky-400/40 rounded-xl px-3 py-1.5 flex items-center gap-2.5 shadow-md">
              <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
              </div>
              <div>
                <span className="text-[9px] text-slate-300 uppercase tracking-wider block font-medium">
                  Metas Atingidas
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white font-mono leading-tight">
                  {stats.taxaSucesso}% Eficiência
                </span>
              </div>
            </div>

            {/* Copiar Link */}
            <button
              onClick={handleCopiarUrl}
              title="Copiar URL direta deste painel"
              className="py-2 px-2.5 text-xs font-semibold text-slate-200 bg-[#030e29] hover:bg-[#0b1d4d] border border-[#123178] rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span className="hidden sm:inline">{copiado ? 'Copiado!' : 'Copiar Link'}</span>
            </button>

            {/* Botão Solicitado: "Abrir painel" (em nova aba) */}
            {!isStandalone && (
              <a
                href={urlPropria}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
                title="Abrir WMS Rotinas em uma nova aba com URL própria"
              >
                <span>Abrir painel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {onVoltarParaHub && (
              <button
                onClick={onVoltarParaHub}
                className="py-2 px-3 text-xs font-semibold text-slate-300 bg-[#030e29] hover:bg-[#0b1d4d] border border-[#123178] rounded-xl transition-colors"
              >
                ← Hub
              </button>
            )}

            <button
              onClick={onIrParaDespacho}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>+ Despachar</span>
            </button>
          </div>

        </div>

        {/* Sub-barra de Filtros Interativos dentro do Banner */}
        <div className="mt-4 pt-3 border-t border-[#123178] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Período */}
          <div className="flex items-center gap-1 bg-[#030e29] p-1 rounded-lg border border-[#123178]">
            <button
              onClick={() => setFiltroPeriodo('hoje')}
              className={`px-2.5 py-1 rounded font-medium transition-colors text-xs ${
                filtroPeriodo === 'hoje' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFiltroPeriodo('7dias')}
              className={`px-2.5 py-1 rounded font-medium transition-colors text-xs ${
                filtroPeriodo === '7dias' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setFiltroPeriodo('todos')}
              className={`px-2.5 py-1 rounded font-medium transition-colors text-xs ${
                filtroPeriodo === 'todos' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Todos
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Busca Colaborador */}
            <input
              type="text"
              placeholder="Buscar colaborador/rua..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="bg-[#030e29] border border-[#123178] text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-sky-400 placeholder:text-slate-500 w-36 sm:w-44"
            />

            {/* Turno / Equipe */}
            <select
              value={filtroEquipe}
              onChange={(e) => setFiltroEquipe(e.target.value)}
              className="bg-[#030e29] border border-[#123178] text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-400"
            >
              <option value="todas">Todos os Turnos</option>
              <option value="Equipe A (Manhã)">Turno 1 (Manhã)</option>
              <option value="Equipe B (Tarde)">Turno 2 (Tarde)</option>
              <option value="Equipe C (Noite)">Turno 3 (Noite)</option>
            </select>

            {/* Cargo */}
            <select
              value={filtroCargo}
              onChange={(e) => setFiltroCargo(e.target.value)}
              className="bg-[#030e29] border border-[#123178] text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-400"
            >
              <option value="todos">Todos os Cargos</option>
              <option value="Auxiliar">Apenas Auxiliares</option>
              <option value="Assistente">Apenas Assistentes</option>
            </select>

            {/* Seção */}
            <select
              value={filtroSecao}
              onChange={(e) => setFiltroSecao(e.target.value)}
              className="bg-[#030e29] border border-[#123178] text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-400"
            >
              <option value="todas">Todas as Seções</option>
              <option value="Líquida">Líquida</option>
              <option value="Alimentar">Alimentar</option>
              <option value="Bazar">Bazar</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Perfumaria">Perfumaria</option>
              <option value="Insumo">Insumo</option>
            </select>

            {/* Meta */}
            <select
              value={filtroMeta}
              onChange={(e) => setFiltroMeta(e.target.value)}
              className="bg-[#030e29] border border-[#123178] text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-400"
            >
              <option value="todos">Todas as Metas</option>
              <option value="Acima da Meta">Acima da Meta</option>
              <option value="Atingiu a Meta">Atingiu a Meta</option>
              <option value="Abaixo da Meta">Abaixo da Meta</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID DE CARDS EM FUNDO BRANCO (AZUL E BRANCO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Tempo Médio de Retorno */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Tempo Médio Retorno (TMR)</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-950 font-mono">
              {stats.tmrGeral > 0 ? formatarTempoMinutos(stats.tmrGeral).substring(0, 5) : '00:00'}
            </span>
            <span className="text-xs text-blue-600 font-bold">h:min</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
            <span>Auxiliares: <strong className="text-slate-900 font-bold">{stats.tmrAux}m</strong></span>
            <span>·</span>
            <span>Assistentes: <strong className="text-slate-900 font-bold">{stats.tmrAss}m</strong></span>
          </div>
        </div>

        {/* KPI 2: Total de Itens Movimentados */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total de Itens / Volumes</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-800">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-950 font-mono">
              {stats.totalItens.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-sky-600 font-bold">unidades</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
            <span>Aux: <strong className="text-slate-900 font-bold">{stats.itensAux.toLocaleString('pt-BR')}</strong></span>
            <span>·</span>
            <span>Ass: <strong className="text-slate-900 font-bold">{stats.itensAss.toLocaleString('pt-BR')}</strong></span>
          </div>
        </div>

        {/* KPI 3: Demandas Concluídas */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Demandas Finalizadas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-950 font-mono">
              {stats.concluidasCount}
            </span>
            <span className="text-xs text-emerald-600 font-bold">entregas</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-amber-600 font-semibold">{pendentes.length} pendentes</span>
            <span>·</span>
            <span className="text-sky-600 font-semibold">{emAndamento.length} no celular</span>
          </div>
        </div>

        {/* KPI 4: Atingimento de Metas */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Status vs. Meta</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-950 font-mono">
              {stats.acimaMetaCount + stats.atingiuMetaCount}
            </span>
            <span className="text-xs text-purple-600 font-bold">dentro/acima</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span className="text-emerald-600 font-semibold">{stats.acimaMetaCount} acima</span>
            <span>·</span>
            <span className="text-sky-600 font-semibold">{stats.atingiuMetaCount} na meta</span>
            <span>·</span>
            <span className="text-rose-600 font-semibold">{stats.abaixoMetaCount} abaixo</span>
          </div>
        </div>

      </div>

      {/* SEÇÃO 1: GRÁFICO POR SEÇÕES (COMO NA IMAGEM: BAZAR, PERFUMARIA, ALIMENTAR, LIQUIDA, LIMPEZA, INSUMO) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              Volume e Produtividade por Seção Comercial
            </h2>
            <p className="text-xs text-slate-500">
              Distribuição de itens movimentados nas seções: Bazar, Perfumaria, Limpeza, Alimentar, Líquida e Insumo.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Total Seções: <strong>{stats.totalItens.toLocaleString('pt-BR')}</strong> itens
          </div>
        </div>

        {/* Barras Horizontais por Seção idênticas à imagem anexada */}
        <div className="space-y-3.5">
          {volumePorSecao.arr.map(({ secao, itens }) => {
            const perc = Math.round((itens / volumePorSecao.maxSecao) * 100);

            return (
              <div key={secao} className="flex items-center gap-3 text-xs">
                <span className="w-24 text-right font-bold text-slate-700 capitalize">
                  {secao}
                </span>

                <div className="flex-1 bg-slate-100 h-6 rounded-lg overflow-hidden relative border border-slate-200/80">
                  <div
                    className="h-full bg-gradient-to-r from-[#051336] to-[#0f3482] rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[11px] font-mono font-bold text-white shadow-xs"
                    style={{ width: `${Math.max(6, perc)}%` }}
                  >
                    {itens > 0 && <span>{itens}</span>}
                  </div>
                </div>

                <span className="w-16 font-mono font-bold text-blue-950 text-right">
                  {itens.toLocaleString('pt-BR')} un
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: QUEM FEZ MAIS (AUXILIAR VS ASSISTENTE) EM FUNDO BRANCO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-800" />
              <h2 className="text-base font-extrabold text-blue-950 tracking-tight">
                Ranking de Produtividade: Quem Fez Mais & Tempo Médio de Retorno
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparativo direto por cargo: volume de itens entregues e agilidade de retorno da demanda.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-900"></span> Auxiliares
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-500"></span> Assistentes
            </span>
          </div>
        </div>

        {/* 2 Colunas Lado a Lado: Auxiliares à esquerda, Assistentes à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* COLUNA 1: AUXILIARES */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    AUX
                  </span>
                  <div>
                    <h3 className="font-bold text-blue-950 text-sm">Auxiliares de Logística</h3>
                    <p className="text-[11px] text-slate-500">{rankingColaboradores.auxiliares.length} colaboradores ativos</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-500">TMR Médio:</span>
                  <div className="font-mono font-bold text-blue-900">{stats.tmrAux} min</div>
                </div>
              </div>

              {rankingColaboradores.auxiliares.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Nenhum retorno de auxiliar registrado no período selecionado.
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingColaboradores.auxiliares.map((colab, idx) => {
                    const percentualVolume = Math.round((colab.totalItens / rankingColaboradores.maxItensAux) * 100);
                    const medalha = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                    return (
                      <div key={colab.nome} className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{medalha}</span>
                            <span className="font-bold text-slate-900">{colab.nome}</span>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">({colab.equipe})</span>
                          </div>
                          <span className="font-mono font-black text-blue-950 text-sm">
                            {colab.totalItens.toLocaleString('pt-BR')} itens
                          </span>
                        </div>

                        {/* Barra de Progresso Azul */}
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-900 to-blue-700 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, percentualVolume)}%` }}
                          ></div>
                        </div>

                        {/* Rodapé do Colaborador: Tarefas, TMR e Itens/Hora */}
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {colab.totalTarefas} {colab.totalTarefas === 1 ? 'retorno' : 'retornos'}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-blue-800 font-bold">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            TMR: {colab.tmrIndividual}m
                          </span>
                          <span className="font-mono font-semibold text-slate-700">
                            {colab.itensPorHoraMedio} un/h
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Total movimentado por auxiliares:</span>
              <strong className="text-blue-950 font-mono font-extrabold">{stats.itensAux.toLocaleString('pt-BR')} itens</strong>
            </div>
          </div>

          {/* COLUNA 2: ASSISTENTES */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ASS
                  </span>
                  <div>
                    <h3 className="font-bold text-blue-950 text-sm">Assistentes de Operações WMS</h3>
                    <p className="text-[11px] text-slate-500">{rankingColaboradores.assistentes.length} colaboradores ativos</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-500">TMR Médio:</span>
                  <div className="font-mono font-bold text-sky-700">{stats.tmrAss} min</div>
                </div>
              </div>

              {rankingColaboradores.assistentes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Nenhum retorno de assistente registrado no período selecionado.
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingColaboradores.assistentes.map((colab, idx) => {
                    const percentualVolume = Math.round((colab.totalItens / rankingColaboradores.maxItensAss) * 100);
                    const medalha = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                    return (
                      <div key={colab.nome} className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{medalha}</span>
                            <span className="font-bold text-slate-900">{colab.nome}</span>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">({colab.equipe})</span>
                          </div>
                          <span className="font-mono font-black text-sky-800 text-sm">
                            {colab.totalItens.toLocaleString('pt-BR')} itens
                          </span>
                        </div>

                        {/* Barra de Progresso Azul Celeste */}
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, percentualVolume)}%` }}
                          ></div>
                        </div>

                        {/* Rodapé do Colaborador: Tarefas, TMR e Itens/Hora */}
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {colab.totalTarefas} {colab.totalTarefas === 1 ? 'retorno' : 'retornos'}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-sky-700 font-bold">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            TMR: {colab.tmrIndividual}m
                          </span>
                          <span className="font-mono font-semibold text-slate-700">
                            {colab.itensPorHoraMedio} un/h
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Total movimentado por assistentes:</span>
              <strong className="text-blue-950 font-mono font-extrabold">{stats.itensAss.toLocaleString('pt-BR')} itens</strong>
            </div>
          </div>

        </div>
      </div>

      {/* SEÇÃO 3: CHÃO DE FÁBRICA AO VIVO & ROTINA DE HOJE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Atividades em Andamento no Celular */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
              <h3 className="font-extrabold text-blue-950 text-sm">
                Atividades em Andamento no Celular ({emAndamento.length})
              </h3>
            </div>
            <button
              onClick={onIrParaMobile}
              className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
            >
              Simular Retorno Mobile <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {emAndamento.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              Nenhuma atividade sendo executada no celular no momento.
              <br />
              <button
                onClick={onIrParaDespacho}
                className="mt-2 text-blue-700 font-bold hover:underline"
              >
                Despachar nova tarefa para a equipe agora →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {emAndamento.map(atv => (
                <div
                  key={atv.id}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{atv.nomeCompleto}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                        {atv.cargo}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {atv.rua}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold mt-0.5">{atv.atividade}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>Despacho: {atv.horaDespacho} ({atv.analistaCriador})</span>
                      <span>·</span>
                      <span>Início: {atv.horaInicio}</span>
                      {atv.itensPrevistos ? (
                        <>
                          <span>·</span>
                          <span className="text-blue-700 font-medium">Meta: {atv.itensPrevistos} un</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 animate-spin text-sky-600" />
                      Em execução
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo da Rotina Semanal de Hoje */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <h3 className="font-extrabold text-blue-950 text-sm">Rotina de {diaSemanaAtual}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold border border-blue-200">
                {tarefasHojeRotina.length} tarefas
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Cronograma operacional padrão do CD MT Trevo.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
              {tarefasHojeRotina.slice(0, 5).map((t, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900 text-[11px] leading-tight">{t.atividade}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="text-blue-800 font-bold">{t.secao}</span>
                      <span>·</span>
                      <span>{t.setorGeral}</span>
                      <span>·</span>
                      <span className="text-sky-700">{t.cargoSugerido}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap font-medium">
                    {t.metaPadrao} {t.unidade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onIrParaDespacho}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-900 font-bold rounded-xl text-xs border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver e Despachar Rotina Completa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
