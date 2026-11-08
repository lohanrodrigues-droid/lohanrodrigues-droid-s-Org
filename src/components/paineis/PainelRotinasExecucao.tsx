import React, { useState } from 'react';
import {
  BarChart3,
  Send,
  Smartphone,
  Users,
  MapPin,
  CalendarDays,
  Database,
  Info,
  CheckSquare,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  Boxes,
  Zap,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { AtividadeOperacional, CargoColaborador, Colaborador, MetaAtividade } from '../../types/wms';
import { TarefaMatrizRotina } from '../../data/rotinaSemanal';
import { getUrlPainel } from '../../utils/painelLinks';

// Subcomponentes integrados no painel
import { PainelDashboard } from '../PainelDashboard';
import { DespachoAnalista } from '../DespachoAnalista';
import { RetornoMobileEquipe } from '../RetornoMobileEquipe';
import { AtividadesPorRuaView } from '../AtividadesPorRuaView';
import { RotinaSemanalView } from '../RotinaSemanalView';
import { BaseDadosTable } from '../BaseDadosTable';
import { DiagnosticoBase } from '../DiagnosticoBase';

export type SubAbaRotinas =
  | 'dashboard'
  | 'despacho'
  | 'retorno_mobile'
  | 'ranking'
  | 'ruas'
  | 'rotina'
  | 'base'
  | 'diagnostico';

interface PainelRotinasExecucaoProps {
  atividades: AtividadeOperacional[];
  colaboradores: Colaborador[];
  metas: MetaAtividade[];
  subAbaAtiva?: SubAbaRotinas;
  onChangeSubAba?: (subAba: SubAbaRotinas) => void;
  onCriarDespacho: (dados: any) => void;
  onIniciarAtividade: (id: string) => void;
  onRetornarAtividade: (params: { id: string; itens: number; rua?: string; observacao?: string }) => void;
  onAdicionarLancamentoManual: (dados: any) => void;
  onExcluirAtividade: (id: string) => void;
  onRecarregarDados: () => void;
  onVoltarParaHub?: () => void;
  isStandalone?: boolean;
  onOpenInstalarModal?: () => void;
}

export const PainelRotinasExecucao: React.FC<PainelRotinasExecucaoProps> = ({
  atividades,
  colaboradores,
  metas,
  subAbaAtiva: subAbaProp,
  onChangeSubAba,
  onCriarDespacho,
  onIniciarAtividade,
  onRetornarAtividade,
  onAdicionarLancamentoManual,
  onExcluirAtividade,
  onRecarregarDados,
  onVoltarParaHub,
  isStandalone = false,
  onOpenInstalarModal
}) => {
  const [subAbaInterna, setSubAbaInterna] = useState<SubAbaRotinas>(subAbaProp || 'dashboard');
  const [copiado, setCopiado] = useState(false);

  // Sub-aba efetiva (controlada ou interna)
  const subAba = subAbaProp || subAbaInterna;
  const setSubAba = (novaSubAba: SubAbaRotinas) => {
    if (onChangeSubAba) onChangeSubAba(novaSubAba);
    setSubAbaInterna(novaSubAba);
  };

  const pendentesCount = atividades.filter(a => a.status === 'Pendente').length;
  const emAndamentoCount = atividades.filter(a => a.status === 'Em Andamento').length;
  const concluidosHojeCount = atividades.filter(a => {
    const hoje = new Date().toISOString().split('T')[0];
    return a.status === 'Concluído' && a.data === hoje;
  }).length;

  const urlPropria = getUrlPainel('rotinas', true);

  const handleCopiarUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(urlPropria).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  const handleAbrirEmNovaAba = () => {
    window.open(urlPropria, '_blank');
  };

  const tabsConfig = [
    {
      id: 'dashboard' as SubAbaRotinas,
      label: 'Visão Geral & Indicadores',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'despacho' as SubAbaRotinas,
      label: 'Despacho Analista (PC)',
      icon: Send,
      badge: pendentesCount > 0 ? pendentesCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      id: 'retorno_mobile' as SubAbaRotinas,
      label: 'Retorno Mobile Equipe',
      icon: Smartphone,
      badge: emAndamentoCount > 0 ? emAndamentoCount : null,
      badgeColor: 'bg-sky-400 text-slate-950 font-bold animate-pulse'
    },
    {
      id: 'ranking' as SubAbaRotinas,
      label: 'Produtividade Aux. & Assist.',
      icon: Users,
      badge: null
    },
    {
      id: 'ruas' as SubAbaRotinas,
      label: 'Atividades por Rua',
      icon: MapPin,
      badge: null
    },
    {
      id: 'rotina' as SubAbaRotinas,
      label: 'Matriz Rotina Semanal',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'base' as SubAbaRotinas,
      label: 'Base Google Forms',
      icon: Database,
      badge: null
    },
    {
      id: 'diagnostico' as SubAbaRotinas,
      label: 'Diagnóstico da Base',
      icon: Info,
      badge: null
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header do Painel WMS Rotinas & Execução */}
      <div className="bg-gradient-to-r from-[#051336] via-[#09225e] to-[#0f3482] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#13327a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {onVoltarParaHub && (
                <button
                  onClick={onVoltarParaHub}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold border border-sky-400/30 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar ao Hub de Painéis</span>
                </button>
              )}
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Painel 2 · Operação & Apontamento
              </span>
              <span className="text-slate-300 text-xs">· CD MT Trevo (Perlog)</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner flex-none">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  WMS Rotinas / Execução
                </h1>
                <p className="text-xs sm:text-sm text-sky-200/90 font-medium">
                  Central unificada de despacho operacional, retorno mobile, monitoramento por rua e produtividade
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação: Abrir Painel em Nova Aba + Copiar Link */}
          <div className="flex flex-wrap items-center gap-2.5 lg:self-center">
            <button
              onClick={handleAbrirEmNovaAba}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              title="Abrir este painel completo em uma nova aba com URL própria"
            >
              <span>Abrir painel</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopiarUrl}
              className="px-3.5 py-2.5 rounded-xl bg-[#030e29]/90 hover:bg-[#071947] border border-[#163884] text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Copiar URL dedicada deste painel"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              <span>{copiado ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

        </div>

        {/* Indicadores Rápidos em Tempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-sky-900/50">
          <button
            onClick={() => setSubAba('despacho')}
            className="bg-[#030e29]/70 hover:bg-[#030e29] border border-[#163884] rounded-2xl p-3.5 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Aguardando Equipe (Pendentes)
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {pendentesCount}
              </div>
            </div>
            <Send className="w-5 h-5 text-amber-400/60 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setSubAba('retorno_mobile')}
            className="bg-[#030e29]/70 hover:bg-[#030e29] border border-[#163884] rounded-2xl p-3.5 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Em Andamento no Celular
              </div>
              <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">
                {emAndamentoCount}
              </div>
            </div>
            <Smartphone className="w-5 h-5 text-sky-400/60 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setSubAba('dashboard')}
            className="bg-[#030e29]/70 hover:bg-[#030e29] border border-[#163884] rounded-2xl p-3.5 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Concluídos Hoje
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {concluidosHojeCount}
              </div>
            </div>
            <BarChart3 className="w-5 h-5 text-emerald-400/60 group-hover:scale-110 transition-transform" />
          </button>
        </div>

      </div>

      {/* Sub-Navegação Interna do Painel WMS Rotinas & Execução */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {tabsConfig.map(tab => {
            const Icon = tab.icon;
            const isAtivo = subAba === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubAba(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isAtivo
                    ? 'bg-[#051336] text-white shadow-md'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isAtivo ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo Dinâmico da Sub-Aba Selecionada */}
      <div className="transition-all duration-200">
        
        {/* Sub-Aba 1: Visão Geral & Dashboard Operacional */}
        {subAba === 'dashboard' && (
          <PainelDashboard
            atividades={atividades}
            onIrParaDespacho={() => setSubAba('despacho')}
            onIrParaMobile={() => setSubAba('retorno_mobile')}
            onIrParaRuas={() => setSubAba('ruas')}
            onVoltarParaHub={onVoltarParaHub}
            isStandalone={isStandalone}
          />
        )}

        {/* Sub-Aba 2: Despacho Analista (PC) */}
        {subAba === 'despacho' && (
          <DespachoAnalista
            atividades={atividades}
            colaboradores={colaboradores}
            metas={metas}
            onCriarDespacho={onCriarDespacho}
            onExcluirAtividade={onExcluirAtividade}
            onIrParaMobile={() => setSubAba('retorno_mobile')}
          />
        )}

        {/* Sub-Aba 3: Retorno Mobile Equipe */}
        {subAba === 'retorno_mobile' && (
          <RetornoMobileEquipe
            atividades={atividades}
            colaboradores={colaboradores}
            metas={metas}
            onIniciarAtividade={onIniciarAtividade}
            onRetornarAtividade={onRetornarAtividade}
            onAdicionarLancamentoManual={onAdicionarLancamentoManual}
            onVoltarParaPainel={() => setSubAba('dashboard')}
            onOpenInstalarModal={onOpenInstalarModal}
          />
        )}

        {/* Sub-Aba 4: Produtividade Aux. & Assist. (Ranking) */}
        {subAba === 'ranking' && (
          <div className="space-y-6">
            <PainelDashboard
              atividades={atividades}
              onIrParaDespacho={() => setSubAba('despacho')}
              onIrParaMobile={() => setSubAba('retorno_mobile')}
              onIrParaRuas={() => setSubAba('ruas')}
              onVoltarParaHub={onVoltarParaHub}
              isStandalone={isStandalone}
            />
          </div>
        )}

        {/* Sub-Aba 5: Atividades por Rua */}
        {subAba === 'ruas' && (
          <AtividadesPorRuaView
            atividades={atividades}
            onIrParaDespachoComRua={(rua) => setSubAba('despacho')}
            onIrParaMobile={() => setSubAba('retorno_mobile')}
          />
        )}

        {/* Sub-Aba 6: Matriz Rotina Semanal */}
        {subAba === 'rotina' && (
          <RotinaSemanalView
            onDespacharTarefa={() => setSubAba('despacho')}
          />
        )}

        {/* Sub-Aba 7: Base de Dados Google Forms */}
        {subAba === 'base' && (
          <BaseDadosTable
            atividades={atividades}
            onAtualizarLista={onRecarregarDados}
            onExcluir={onExcluirAtividade}
            onNovoLancamento={() => setSubAba('despacho')}
          />
        )}

        {/* Sub-Aba 8: Diagnóstico da Base */}
        {subAba === 'diagnostico' && (
          <DiagnosticoBase />
        )}

      </div>

    </div>
  );
};
