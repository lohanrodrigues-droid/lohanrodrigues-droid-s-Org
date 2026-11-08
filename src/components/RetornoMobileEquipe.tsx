import React, { useState, useMemo } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Play,
  Clock,
  Send,
  Boxes,
  MapPin,
  AlertTriangle,
  Award,
  ChevronRight,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  UserCheck
} from 'lucide-react';
import { AtividadeOperacional, CargoColaborador, Colaborador, MetaAtividade } from '../types/wms';
import { RUAS_PADRAO, SETORES_PADRAO } from '../data/mockData';
import { SECOES_CD_MT } from '../data/rotinaSemanal';
import { formatarTempoMinutos, getHoraAtual } from '../utils/wmsCalculations';

interface RetornoMobileEquipeProps {
  atividades: AtividadeOperacional[];
  colaboradores: Colaborador[];
  metas: MetaAtividade[];
  onIniciarAtividade: (id: string) => void;
  onRetornarAtividade: (params: { id: string; itens: number; rua?: string; observacao?: string }) => void;
  onAdicionarLancamentoManual: (dados: any) => void;
  onVoltarParaPainel: () => void;
  onOpenInstalarModal?: () => void;
}

export const RetornoMobileEquipe: React.FC<RetornoMobileEquipeProps> = ({
  atividades,
  colaboradores,
  metas,
  onIniciarAtividade,
  onRetornarAtividade,
  onAdicionarLancamentoManual,
  onVoltarParaPainel,
  onOpenInstalarModal
}) => {
  const executores = useMemo(() => {
    return colaboradores.filter(c => c.cargo === 'Auxiliar' || c.cargo === 'Assistente');
  }, [colaboradores]);

  const [colaboradorAtivoId, setColaboradorAtivoId] = useState<string>(() => {
    const aux = executores.find(e => e.cargo === 'Auxiliar');
    return aux ? aux.id : (executores[0]?.id || '');
  });

  const colaboradorAtivo = useMemo(() => {
    return colaboradores.find(c => c.id === colaboradorAtivoId) || executores[0];
  }, [colaboradores, colaboradorAtivoId, executores]);

  // Modal de Retorno
  const [atividadeEmRetorno, setAtividadeEmRetorno] = useState<AtividadeOperacional | null>(null);
  const [retornoItens, setRetornoItens] = useState<number>(0);
  const [retornoRua, setRetornoRua] = useState<string>('');
  const [retornoObservacao, setRetornoObservacao] = useState<string>('');
  const [msgSucessoRetorno, setMsgSucessoRetorno] = useState<string>('');

  // Lançamento Avulso
  const [mostrarAvulso, setMostrarAvulso] = useState(false);
  const [avulsoAtividade, setAvulsoAtividade] = useState('Check de Picking C/Saldo Sem estoque');
  const [avulsoSecao, setAvulsoSecao] = useState('Alimentar');
  const [avulsoSetor, setAvulsoSetor] = useState('Separação');
  const [avulsoRua, setAvulsoRua] = useState('Rua 04');
  const [avulsoItens, setAvulsoItens] = useState<number>(50);
  const [avulsoHoraInicio, setAvulsoHoraInicio] = useState('08:00');
  const [avulsoHoraFim, setAvulsoHoraFim] = useState(getHoraAtual());
  const [avulsoObservacao, setAvulsoObservacao] = useState('');

  const minhasAtividades = useMemo(() => {
    if (!colaboradorAtivo) return [];
    return atividades.filter(a => a.nomeCompleto === colaboradorAtivo.nome);
  }, [atividades, colaboradorAtivo]);

  const minhasPendentes = useMemo(() => minhasAtividades.filter(a => a.status === 'Pendente'), [minhasAtividades]);
  const minhasEmAndamento = useMemo(() => minhasAtividades.filter(a => a.status === 'Em Andamento'), [minhasAtividades]);
  const minhasConcluidas = useMemo(() => minhasAtividades.filter(a => a.status === 'Concluído'), [minhasAtividades]);

  const metricasHoje = useMemo(() => {
    const totalItens = minhasConcluidas.reduce((acc, c) => acc + (c.itens || 0), 0);
    const totalMinutos = minhasConcluidas.reduce((acc, c) => acc + (c.tempoRetornoMinutos || c.tempoExecucaoMinutos || 0), 0);
    const tmr = minhasConcluidas.length > 0 ? Math.round(totalMinutos / minhasConcluidas.length) : 0;
    return {
      totalItens,
      tarefasCount: minhasConcluidas.length,
      tmr
    };
  }, [minhasConcluidas]);

  const abrirModalRetorno = (atv: AtividadeOperacional) => {
    setAtividadeEmRetorno(atv);
    setRetornoItens(atv.itensPrevistos || atv.itens || 0);
    setRetornoRua(atv.rua);
    setRetornoObservacao('');
  };

  const handleConfirmarRetorno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividadeEmRetorno) return;

    onRetornarAtividade({
      id: atividadeEmRetorno.id,
      itens: Number(retornoItens) || 0,
      rua: retornoRua,
      observacao: retornoObservacao
    });

    setMsgSucessoRetorno(`Retorno da atividade "${atividadeEmRetorno.atividade}" enviado com sucesso! O Analista já recebeu no painel.`);
    setAtividadeEmRetorno(null);
    setTimeout(() => setMsgSucessoRetorno(''), 5000);
  };

  const handleSalvarAvulso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaboradorAtivo) return;

    onAdicionarLancamentoManual({
      nomeCompleto: colaboradorAtivo.nome,
      cargo: colaboradorAtivo.cargo,
      equipe: colaboradorAtivo.equipe,
      setor: avulsoSetor,
      secao: avulsoSecao,
      atividade: avulsoAtividade,
      itens: Number(avulsoItens) || 0,
      rua: avulsoRua,
      observacao: avulsoObservacao,
      horaInicio: avulsoHoraInicio,
      horaFim: avulsoHoraFim,
      data: new Date().toISOString().split('T')[0],
      analistaCriador: 'Lançamento Mobile Direto'
    });

    setMsgSucessoRetorno('Lançamento direto registrado com sucesso!');
    setMostrarAvulso(false);
    setTimeout(() => setMsgSucessoRetorno(''), 5000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 sm:py-6">
      
      {/* Container simulando Smartphone / Coletor em Azul e Branco */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Barra superior de status do celular em Azul Corporativo */}
        <div className="bg-[#051336] px-5 py-3 flex items-center justify-between text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <Smartphone className="w-3.5 h-3.5" />
            <span>TERMINAL MOBILE MT-WMS</span>
          </div>
          <span className="text-white font-bold">{getHoraAtual()}</span>
        </div>

        {/* Header do Operador */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 font-semibold">Operador Conectado:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-900 border border-blue-200">
              CD MT TREVO
            </span>
          </div>

          {/* Seletor de Colaborador */}
          <select
            value={colaboradorAtivoId}
            onChange={(e) => setColaboradorAtivoId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-blue-950 focus:outline-none focus:border-blue-600 shadow-2xs"
          >
            <optgroup label="Auxiliares de Logística">
              {executores.filter(c => c.cargo === 'Auxiliar').map(c => (
                <option key={c.id} value={c.id}>👤 {c.nome} (Auxiliar - {c.equipe})</option>
              ))}
            </optgroup>
            <optgroup label="Assistentes de Operações">
              {executores.filter(c => c.cargo === 'Assistente').map(c => (
                <option key={c.id} value={c.id}>⭐ {c.nome} (Assistente - {c.equipe})</option>
              ))}
            </optgroup>
          </select>

          {/* Cards de Métricas do Dia */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Itens Hoje</span>
              <strong className="text-base font-extrabold text-blue-950 font-mono">
                {metricasHoje.totalItens}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Retornos</span>
              <strong className="text-base font-extrabold text-emerald-700 font-mono">
                {metricasHoje.tarefasCount}
              </strong>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">TMR Médio</span>
              <strong className="text-base font-extrabold text-sky-700 font-mono">
                {metricasHoje.tmr}m
              </strong>
            </div>
          </div>
        </div>

        {/* Mensagem de sucesso */}
        {msgSucessoRetorno && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 p-3 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{msgSucessoRetorno}</span>
          </div>
        )}

        {/* Corpo de Atividades */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[580px] bg-slate-50/50">
          
          {/* Banner de Dica para Instalação no Celular */}
          {onOpenInstalarModal && (
            <button
              onClick={onOpenInstalarModal}
              className="w-full bg-gradient-to-r from-[#051336] to-[#0c2463] p-3 rounded-2xl text-white text-xs flex items-center justify-between shadow-xs hover:opacity-95 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white block">Quer usar como Aplicativo?</span>
                  <span className="text-[10px] text-sky-200">Instale na tela inicial sem lojas de app</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-sky-400 text-slate-950 px-2.5 py-1 rounded-lg">
                Como Baixar
              </span>
            </button>
          )}

          {/* Seção 1: Atividades em Andamento */}
          {minhasEmAndamento.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
                <h3 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">
                  Em Execução Agora ({minhasEmAndamento.length})
                </h3>
              </div>

              <div className="space-y-3">
                {minhasEmAndamento.map(atv => (
                  <div
                    key={atv.id}
                    className="bg-white rounded-2xl p-4 border-2 border-sky-500 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-sky-50 text-sky-900 border border-sky-200">
                        {atv.secao || atv.setor}
                      </span>
                      <span className="text-blue-900 font-mono font-bold text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        {atv.rua}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-blue-950 text-base leading-tight">
                        {atv.atividade}
                      </h4>
                      {atv.observacao && (
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl mt-2 border border-slate-200">
                          💬 {atv.observacao}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Iniciado às: <strong className="text-slate-900">{atv.horaInicio}</strong></span>
                      <span>Meta: <strong className="text-blue-900 font-bold">{atv.itensPrevistos || '--'} un</strong></span>
                    </div>

                    {/* BOTÃO GRANDE DE FINALIZAR E DAR RETORNO */}
                    <button
                      onClick={() => abrirModalRetorno(atv)}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>FINALIZAR E DAR RETORNO</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção 2: Atividades Pendentes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Demandas para Iniciar ({minhasPendentes.length})
              </h3>
            </div>

            {minhasPendentes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-500 shadow-2xs">
                Nenhuma demanda pendente aguardando início para você no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {minhasPendentes.map(atv => (
                  <div
                    key={atv.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          {atv.secao || atv.setor}
                        </span>
                        {atv.prioridade === 'Urgente' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-blue-900 flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3 text-blue-700" />
                        {atv.rua}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-blue-950 text-sm">
                        {atv.atividade}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Despachado por <strong>{atv.analistaCriador}</strong> às {atv.horaDespacho}
                      </p>
                      {atv.observacao && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-200">
                          💬 {atv.observacao}
                        </p>
                      )}
                    </div>

                    {/* BOTÃO GRANDE DE INICIAR */}
                    <button
                      onClick={() => onIniciarAtividade(atv.id)}
                      className="w-full py-3 bg-[#051336] hover:bg-[#0c2463] text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-sky-400 text-sky-400" />
                      <span>INICIAR ATIVIDADE AGORA</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Lançamento Avulso */}
          <div className="pt-2">
            <button
              onClick={() => setMostrarAvulso(!mostrarAvulso)}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center justify-center gap-2 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-blue-700" />
              <span>{mostrarAvulso ? 'Fechar Lançamento Avulso' : '+ Fazer Lançamento Avulso / Rápido'}</span>
            </button>
          </div>

          {/* Formulário Avulso */}
          {mostrarAvulso && (
            <form onSubmit={handleSalvarAvulso} className="bg-white p-4 rounded-2xl border border-slate-300 space-y-3 text-xs shadow-md">
              <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-700" />
                Lançamento sem Despacho Prévio
              </h4>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Seção Comercial</label>
                <select
                  value={avulsoSecao}
                  onChange={(e) => setAvulsoSecao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                >
                  {SECOES_CD_MT.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Atividade Realizada</label>
                <input
                  type="text"
                  value={avulsoAtividade}
                  onChange={(e) => setAvulsoAtividade(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Rua (Check)</label>
                  <select
                    value={avulsoRua}
                    onChange={(e) => setAvulsoRua(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold"
                  >
                    {RUAS_PADRAO.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Itens Realizados</label>
                  <input
                    type="number"
                    min="1"
                    value={avulsoItens}
                    onChange={(e) => setAvulsoItens(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Hora Início</label>
                  <input
                    type="time"
                    value={avulsoHoraInicio}
                    onChange={(e) => setAvulsoHoraInicio(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Hora Fim</label>
                  <input
                    type="time"
                    value={avulsoHoraFim}
                    onChange={(e) => setAvulsoHoraFim(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Observação</label>
                <input
                  type="text"
                  value={avulsoObservacao}
                  onChange={(e) => setAvulsoObservacao(e.target.value)}
                  placeholder="Ex: Auditoria sem divergências"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#051336] hover:bg-[#0c2463] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Salvar Lançamento Direto
              </button>
            </form>
          )}

          {/* Histórico Recente de Retornos */}
          <div>
            <h3 className="font-extrabold text-slate-500 text-[11px] uppercase tracking-wider mb-2">
              Seus Retornos Concluídos Hoje ({minhasConcluidas.length})
            </h3>

            <div className="space-y-2">
              {minhasConcluidas.slice(0, 4).map(c => (
                <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.atividade}</div>
                    <div className="text-[10px] text-slate-500">
                      Rua {c.rua} · Retornado às {c.horaRetorno || c.horaFim}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-blue-950 block">
                      {c.itens} un
                    </span>
                    <span className="text-[10px] text-sky-700 font-mono font-bold">
                      TMR: {c.tempoRetornoMinutos}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Rodapé Mobile */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 text-center">
          <button
            onClick={onVoltarParaPainel}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 transition-colors"
          >
            ← Voltar para Painel do Analista (Desktop)
          </button>
        </div>

      </div>

      {/* MODAL DE RETORNO EM BRANCO E AZUL */}
      {atividadeEmRetorno && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white border border-slate-300 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-fade-in space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  CONFIRMAÇÃO DE RETORNO
                </span>
                <h3 className="font-black text-blue-950 text-base mt-1">
                  {atividadeEmRetorno.atividade}
                </h3>
              </div>
              <button
                onClick={() => setAtividadeEmRetorno(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmarRetorno} className="space-y-4 text-xs">
              
              {/* Quantidade Realizada */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantidade Realizada (Itens / Volumes) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={retornoItens}
                  onChange={(e) => setRetornoItens(parseInt(e.target.value) || 0)}
                  required
                  className="w-full bg-slate-50 border-2 border-emerald-500 rounded-xl p-3 text-2xl font-mono font-black text-emerald-800 text-center focus:outline-none focus:border-emerald-600 focus:bg-white"
                />

                {/* Steppers rápidos */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[10, 25, 50, 100].map(qtd => (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => setRetornoItens(prev => prev + qtd)}
                      className="py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-mono font-bold text-[11px] border border-blue-200 transition-colors"
                    >
                      +{qtd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rua de Confirmação */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Rua / Posição (Check)
                </label>
                <select
                  value={retornoRua}
                  onChange={(e) => setRetornoRua(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {RUAS_PADRAO.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Observação Operacional / Ocorrência
                </label>
                <input
                  type="text"
                  value={retornoObservacao}
                  onChange={(e) => setRetornoObservacao(e.target.value)}
                  placeholder="Ex: Sem avarias, 100% conferido"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />

                <div className="flex flex-wrap gap-1 mt-2">
                  {['100% Ok', 'Sem divergência', 'Saldo corrigido', 'Avaria identificada'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRetornoObservacao(tag)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>CONFIRMAR E ENVIAR RETORNO</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
