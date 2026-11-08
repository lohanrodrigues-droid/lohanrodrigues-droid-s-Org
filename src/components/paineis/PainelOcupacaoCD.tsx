import React, { useState, useMemo } from 'react';
import {
  Building2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Info,
  Boxes,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
  Copy,
  Check,
  Maximize2
} from 'lucide-react';
import { METRICAS_OCUPACAO_CD, RUAS_OCUPACAO_CD } from '../../data/mockHubEstoque';
import { ResumoRuaOcupacao, SecaoComercial, TipoPosicao } from '../../types/hubEstoque';
import { getUrlPainel } from '../../utils/painelLinks';

interface PainelOcupacaoCDProps {
  onIrParaDespacho?: () => void;
  onVoltarParaHub?: () => void;
  isStandalone?: boolean;
}

export const PainelOcupacaoCD: React.FC<PainelOcupacaoCDProps> = ({
  onIrParaDespacho,
  onVoltarParaHub,
  isStandalone = false
}) => {
  const [busca, setBusca] = useState<string>('');
  const [secaoFiltro, setSecaoFiltro] = useState<string>('Todas');
  const [tipoFiltro, setTipoFiltro] = useState<string>('Todos');
  const [faixaOcupacao, setFaixaOcupacao] = useState<'Todas' | 'Criticas' | 'Atencao' | 'Normais'>('Todas');
  const [ruaFiltro, setRuaFiltro] = useState<string>('Todas');
  const [ruaSelecionada, setRuaSelecionada] = useState<ResumoRuaOcupacao | null>(RUAS_OCUPACAO_CD[3]); // Rua 04
  const [copiado, setCopiado] = useState(false);

  const secoes: string[] = ['Todas', 'Líquida', 'Alimentar', 'Bazar', 'Limpeza', 'Perfumaria', 'Insumo'];
  const tipos: string[] = ['Todos', 'Picking Fracionado', 'Pulmão Aéreo', 'Mezanino'];

  const urlPropria = getUrlPainel('ocupacao', true);

  const handleCopiarUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(urlPropria).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  const ruasFiltradas = useMemo(() => {
    return RUAS_OCUPACAO_CD.filter(r => {
      if (busca) {
        const b = busca.toLowerCase();
        if (!r.rua.toLowerCase().includes(b) && !r.secao.toLowerCase().includes(b)) {
          return false;
        }
      }
      if (secaoFiltro !== 'Todas' && r.secao !== secaoFiltro) return false;
      if (tipoFiltro !== 'Todos' && r.tipoPredominante !== tipoFiltro) return false;
      if (ruaFiltro !== 'Todas' && r.rua !== ruaFiltro) return false;

      if (faixaOcupacao === 'Criticas' && r.percentualOcupacao < 90) return false;
      if (faixaOcupacao === 'Atencao' && (r.percentualOcupacao < 85 || r.percentualOcupacao >= 90)) return false;
      if (faixaOcupacao === 'Normais' && r.percentualOcupacao >= 85) return false;

      return true;
    });
  }, [busca, secaoFiltro, tipoFiltro, faixaOcupacao, ruaFiltro]);

  const getCorOcupacao = (pct: number) => {
    if (pct >= 90) return 'bg-rose-500 text-white border-rose-600';
    if (pct >= 85) return 'bg-amber-500 text-slate-950 border-amber-600';
    return 'bg-emerald-500 text-white border-emerald-600';
  };

  const getCorBarra = (pct: number) => {
    if (pct >= 90) return 'bg-rose-500';
    if (pct >= 85) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header do Painel com Botão "Abrir painel" em Nova Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Painel 01 · Capacidade Física
            </span>
            <span className="text-xs text-slate-400">· CD Trevo Mato Grosso</span>
            {isStandalone && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Página Dedicada
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Ocupação do CD Trevo</span>
          </h1>
          <p className="text-xs text-slate-500">
            Monitoramento de posições totais, ocupadas, vagas e bloqueadas por rua com mapa de calor de gargalos (&gt;90%).
          </p>
        </div>

        {/* Botões de Ação: Abrir Painel em Nova Aba, Copiar Link e Despacho */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          
          {/* Copiar Link Dedicado */}
          <button
            onClick={handleCopiarUrl}
            title="Copiar URL direta deste painel"
            className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">{copiado ? 'Link Copiado!' : 'Copiar Link'}</span>
          </button>

          {/* Botão Solicitado: "Abrir painel" (em nova aba) */}
          {!isStandalone && (
            <a
              href={urlPropria}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              title="Abrir este painel em uma nova aba com URL própria"
            >
              <span>Abrir painel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {onVoltarParaHub && (
            <button
              onClick={onVoltarParaHub}
              className="py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ← Voltar ao Hub
            </button>
          )}

          {onIrParaDespacho && (
            <button
              onClick={onIrParaDespacho}
              className="py-2 px-3 text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm transition-all"
            >
              Despachar Conferência
            </button>
          )}
        </div>
      </div>

      {/* 4 Cards de KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Posições Totais */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Posições Totais</span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {METRICAS_OCUPACAO_CD.totalPosicoes.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-blue-600">24 Ruas ativas</span>
            <span>· Níveis 01 a 05</span>
          </div>
        </div>

        {/* Ocupadas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Posições Ocupadas</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
              {METRICAS_OCUPACAO_CD.taxaOcupacaoGeral}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            {METRICAS_OCUPACAO_CD.posicoesOcupadas.toLocaleString('pt-BR')}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${METRICAS_OCUPACAO_CD.taxaOcupacaoGeral}%` }} />
          </div>
        </div>

        {/* Vagas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Posições Vagas</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
              11.5%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {METRICAS_OCUPACAO_CD.posicoesVagas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disponíveis para armazenagem</span>
          </div>
        </div>

        {/* Bloqueadas & Alerta */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Bloqueadas / Avarias</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
              2.7%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {METRICAS_OCUPACAO_CD.posicoesBloqueadas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{METRICAS_OCUPACAO_CD.ruasCriticas} ruas com ocupação &gt; 90%</span>
          </div>
        </div>

      </div>

      {/* Barra de Filtros Interativos do Painel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filtros Interativos de Capacidade</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Exibindo <strong>{ruasFiltradas.length}</strong> de 24 ruas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Busca por Rua */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Buscar Rua</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ex.: Rua 04..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Filtro por Seção */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Seção Comercial</label>
            <select
              value={secaoFiltro}
              onChange={e => setSecaoFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              {secoes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Estrutura */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tipo de Estrutura</label>
            <select
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              {tipos.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Faixa de Ocupação */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Faixa de Ocupação</label>
            <select
              value={faixaOcupacao}
              onChange={e => setFaixaOcupacao(e.target.value as any)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="Todas">Todas as Faixas</option>
              <option value="Criticas">⚠️ Críticas (&gt; 90%)</option>
              <option value="Atencao">⚡ Atenção (85% - 89%)</option>
              <option value="Normais">✓ Normais (&lt; 85%)</option>
            </select>
          </div>

          {/* Rua Direta */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Rua Específica</label>
            <select
              value={ruaFiltro}
              onChange={e => setRuaFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="Todas">Todas as 24 Ruas</option>
              {RUAS_OCUPACAO_CD.map(r => (
                <option key={r.rua} value={r.rua}>{r.rua} ({r.percentualOcupacao}%)</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Seção Principal: Mapa de Calor por Rua + Detalhamento da Rua Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Mapa de Calor das Ruas (8 colunas) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Mapa de Calor das Ruas do CD</h2>
              <p className="text-[11px] text-slate-500">Clique em qualquer rua para ver a estrutura e níveis de apanha</p>
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 hidden sm:flex">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>&lt;85%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>85-89%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span>≥90%</span>
              </div>
            </div>
          </div>

          {/* Grid de Ruas */}
          {ruasFiltradas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhuma rua encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ruasFiltradas.map(rua => {
                const isSelected = ruaSelecionada?.rua === rua.rua;
                return (
                  <button
                    key={rua.rua}
                    onClick={() => setRuaSelecionada(rua)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{rua.rua}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getCorOcupacao(rua.percentualOcupacao)}`}>
                        {rua.percentualOcupacao}%
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 mb-2 truncate">
                      {rua.secao} · {rua.tipoPredominante.split(' ')[0]}
                    </div>

                    {/* Barra de Progresso da Rua */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${getCorBarra(rua.percentualOcupacao)}`}
                        style={{ width: `${Math.min(rua.percentualOcupacao, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{rua.ocupadas} ocup.</span>
                      <span>{rua.vagas} vagas</span>
                    </div>

                    {rua.alertaGargalo && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* Detalhe da Rua Selecionada (4 colunas) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {ruaSelecionada ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    Detalhe Operacional
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {ruaSelecionada.rua}
                  </h3>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${getCorOcupacao(ruaSelecionada.percentualOcupacao)}`}>
                  {ruaSelecionada.percentualOcupacao}% Ocupada
                </div>
              </div>

              {/* Informações da Rua */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Seção Comercial:</span>
                  <span className="font-bold text-slate-800">{ruaSelecionada.secao}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tipo Predominante:</span>
                  <span className="font-bold text-slate-800">{ruaSelecionada.tipoPredominante}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total de Posições:</span>
                  <span className="font-bold text-slate-800">{ruaSelecionada.totalPosicoes} posições</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Posições Ocupadas:</span>
                  <span className="font-bold text-blue-700">{ruaSelecionada.ocupadas}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Posições Livres/Vagas:</span>
                  <span className="font-bold text-emerald-600">{ruaSelecionada.vagas} vagas</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Posições Bloqueadas:</span>
                  <span className="font-bold text-rose-600">{ruaSelecionada.bloqueadas} bloqueios</span>
                </div>
              </div>

              {/* Diagnóstico & Recomendação de Ação */}
              {ruaSelecionada.alertaGargalo ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Atenção: Gargalo Operacional!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    A {ruaSelecionada.rua} ultrapassou o limite de segurança de 90%. Há risco de indisponibilidade de apanha ou bloqueio de corredor.
                  </p>
                  {onIrParaDespacho && (
                    <button
                      onClick={onIrParaDespacho}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                    >
                      Despachar Liberação de Pulmão
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Capacidade Operacional Estável</span>
                  </div>
                  <p className="text-[11px]">
                    Nível de ocupação dentro da meta logística do CD Trevo.
                  </p>
                </div>
              )}

              {/* Estrutura Vertical de Níveis */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-700">Estrutura Vertical (Porta-Pallets):</span>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Nível 05 (Pulmão Alto)</span>
                    <span className="text-slate-700 font-bold">88%</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Nível 04 (Pulmão Médio)</span>
                    <span className="text-slate-700 font-bold">86%</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Nível 03 (Pulmão Baixo)</span>
                    <span className="text-slate-700 font-bold">82%</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Nível 02 (Pulmão Picking)</span>
                    <span className="text-slate-700 font-bold">84%</span>
                  </div>
                  <div className="p-1.5 bg-blue-50 rounded border border-blue-200 flex justify-between font-bold text-blue-900">
                    <span>Nível 01 (Apanha / Picking)</span>
                    <span>94% ⚠️</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Selecione uma rua no mapa ao lado para inspecionar.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
