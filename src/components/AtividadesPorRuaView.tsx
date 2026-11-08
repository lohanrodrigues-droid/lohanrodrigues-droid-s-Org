import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Boxes,
  Users,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { AtividadeOperacional } from '../types/wms';
import { SECOES_CD_MT } from '../data/rotinaSemanal';

interface AtividadesPorRuaViewProps {
  atividades: AtividadeOperacional[];
  onIrParaDespachoComRua?: (rua: string) => void;
  onIrParaMobile?: () => void;
}

export const AtividadesPorRuaView: React.FC<AtividadesPorRuaViewProps> = ({
  atividades,
  onIrParaDespachoComRua,
  onIrParaMobile
}) => {
  const [ruaSelecionada, setRuaSelecionada] = useState<string | null>(null);
  const [filtroSecao, setFiltroSecao] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'Em Andamento' | 'Pendente' | 'Concluído'>('todos');
  const [busca, setBusca] = useState<string>('');

  // Total de 24 ruas do CD MT Trevo
  const todasRuas = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `Rua ${num}`;
    });
  }, []);

  // Agrupamento de atividades por rua
  const estatisticasPorRua = useMemo(() => {
    const mapa: Record<string, {
      total: number;
      emAndamento: number;
      pendentes: number;
      concluidas: number;
      itensTotal: number;
      atividades: AtividadeOperacional[];
      secoes: Set<string>;
    }> = {};

    todasRuas.forEach(r => {
      mapa[r] = {
        total: 0,
        emAndamento: 0,
        pendentes: 0,
        concluidas: 0,
        itensTotal: 0,
        atividades: [],
        secoes: new Set()
      };
    });

    atividades.forEach(a => {
      const r = a.rua ? a.rua.trim() : null;
      if (r && mapa[r]) {
        mapa[r].total += 1;
        mapa[r].atividades.push(a);
        mapa[r].itensTotal += a.itens;
        if (a.secao) mapa[r].secoes.add(a.secao);

        if (a.status === 'Em Andamento') mapa[r].emAndamento += 1;
        else if (a.status === 'Pendente') mapa[r].pendentes += 1;
        else if (a.status === 'Concluído') mapa[r].concluidas += 1;
      }
    });

    return mapa;
  }, [atividades, todasRuas]);

  // Ruas filtradas
  const ruasFiltradas = useMemo(() => {
    return todasRuas.filter(r => {
      const stats = estatisticasPorRua[r];
      if (filtroStatus === 'Em Andamento' && stats.emAndamento === 0) return false;
      if (filtroStatus === 'Pendente' && stats.pendentes === 0) return false;
      if (filtroStatus === 'Concluído' && stats.concluidas === 0) return false;

      if (filtroSecao !== 'todas') {
        const temSecao = Array.from(stats.secoes).includes(filtroSecao);
        if (!temSecao) return false;
      }

      if (busca) {
        const b = busca.toLowerCase();
        const matchRua = r.toLowerCase().includes(b);
        const matchAtiv = stats.atividades.some(a =>
          a.nomeCompleto.toLowerCase().includes(b) ||
          a.atividade.toLowerCase().includes(b) ||
          (a.secao && a.secao.toLowerCase().includes(b))
        );
        if (!matchRua && !matchAtiv) return false;
      }

      return true;
    });
  }, [todasRuas, estatisticasPorRua, filtroStatus, filtroSecao, busca]);

  const resumo = useMemo(() => {
    let ruasComAtividade = 0;
    let ruasEmAndamento = 0;
    let ruasPendentes = 0;

    todasRuas.forEach(r => {
      const s = estatisticasPorRua[r];
      if (s.total > 0) ruasComAtividade++;
      if (s.emAndamento > 0) ruasEmAndamento++;
      if (s.pendentes > 0) ruasPendentes++;
    });

    return { ruasComAtividade, ruasEmAndamento, ruasPendentes, totalRuas: 24 };
  }, [todasRuas, estatisticasPorRua]);

  const ruaAtivaDetalhes = ruaSelecionada ? estatisticasPorRua[ruaSelecionada] : null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Informativo */}
      <div className="bg-gradient-to-r from-[#051336] via-[#09225e] to-[#0f3482] rounded-2xl p-6 text-white shadow-md border border-[#123178]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Mapeamento Físico do Armazém
              </span>
              <span className="text-xs text-sky-200/70">· CD MT Trevo</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-sky-400" />
              Atividades Operacionais por Rua (01 a 24)
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Monitore em tempo real as ruas do CD onde as equipes de auxiliares e assistentes estão realizando contagens, inventários rotativos, agrupamentos e checagens de endereço.
            </p>
          </div>

          {/* Cartões Rápidos de Resumo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#030e29]/70 border border-[#163884] rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Ruas com Atividades</div>
              <div className="text-xl font-black text-sky-300 font-mono mt-0.5">
                {resumo.ruasComAtividade} <span className="text-xs text-slate-400">/ 24</span>
              </div>
            </div>
            <div className="bg-[#030e29]/70 border border-[#163884] rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Em Andamento</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {resumo.ruasEmAndamento}
              </div>
            </div>
            <div className="bg-[#030e29]/70 border border-[#163884] rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Aguardando Equipe</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                {resumo.ruasPendentes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Busca */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar rua, colaborador..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {/* Filtro por Status */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['todos', 'Em Andamento', 'Pendente', 'Concluído'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFiltroStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filtroStatus === st
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'todos' ? 'Todas' : st}
              </button>
            ))}
          </div>

          {/* Filtro por Seção */}
          <select
            value={filtroSecao}
            onChange={(e) => setFiltroSecao(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="todas">Todas as Seções</option>
            {SECOES_CD_MT.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Exibindo <strong>{ruasFiltradas.length}</strong> de 24 ruas
        </div>
      </div>

      {/* Grid das 24 Ruas do CD MT Trevo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ruasFiltradas.map(rua => {
          const stats = estatisticasPorRua[rua];
          const isSelected = ruaSelecionada === rua;
          
          let statusCor = 'border-slate-200 bg-white hover:border-slate-300';
          let statusBadge = <span className="text-[10px] text-slate-400 font-medium">Livre</span>;

          if (stats.emAndamento > 0) {
            statusCor = 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400';
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Em Andamento ({stats.emAndamento})
              </span>
            );
          } else if (stats.pendentes > 0) {
            statusCor = 'border-amber-300 bg-amber-50/50 hover:border-amber-400';
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Pendente ({stats.pendentes})
              </span>
            );
          } else if (stats.concluidas > 0) {
            statusCor = 'border-blue-200 bg-blue-50/30 hover:border-blue-300';
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                {stats.concluidas} Concluída(s)
              </span>
            );
          }

          return (
            <button
              key={rua}
              onClick={() => setRuaSelecionada(isSelected ? null : rua)}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${statusCor} ${
                isSelected ? 'ring-2 ring-blue-600 shadow-md scale-[1.02]' : 'shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-blue-950 text-base">{rua}</span>
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>

              <div className="mb-2">
                {statusBadge}
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Itens: <span className="font-mono font-bold text-slate-900">{stats.itensTotal}</span></div>
                <div>Tarefas: <span className="font-mono font-bold text-slate-900">{stats.total}</span></div>
              </div>

              {stats.secoes.size > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {Array.from(stats.secoes).map(sec => (
                    <span key={sec} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold">
                      {sec}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Painel de Detalhes da Rua Selecionada */}
      {ruaSelecionada && ruaAtivaDetalhes && (
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-blue-950">
                  Detalhamento Operacional: {ruaSelecionada}
                </h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                  {ruaAtivaDetalhes.total} atividades registradas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Lista de ordens de serviço, colaboradores em campo e status de retorno.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onIrParaDespachoComRua && (
                <button
                  onClick={() => onIrParaDespachoComRua(ruaSelecionada)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Novo Despacho para {ruaSelecionada}</span>
                </button>
              )}
              <button
                onClick={() => setRuaSelecionada(null)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>

          {ruaAtivaDetalhes.atividades.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Nenhuma atividade registrada no momento para esta rua.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ruaAtivaDetalhes.atividades.map(ativ => (
                <div key={ativ.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{ativ.atividade}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {ativ.secao || 'Geral'}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Operador: <span className="font-semibold text-slate-800">{ativ.nomeCompleto}</span> ({ativ.cargo}) · Equipe: {ativ.equipe}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-bold text-blue-950">{ativ.itens} itens</div>
                      <div className="text-[10px] text-slate-400">{ativ.data} {ativ.horaInicio}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ativ.status === 'Concluído'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ativ.status === 'Em Andamento'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ativ.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
