import React, { useState, useMemo } from 'react';
import {
  Send,
  Users,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  ArrowRight,
  Warehouse,
  ChevronDown,
  Layers,
  Calendar,
  X,
  Play
} from 'lucide-react';
import { AtividadeOperacional, CargoColaborador, Colaborador, MetaAtividade } from '../types/wms';
import { RUAS_PADRAO, SETORES_PADRAO } from '../data/mockData';
import { MATRIZ_ROTINA_SEMANAL, SECOES_CD_MT, getMatrizPorDia, getDiaSemanaAtualNome, TarefaMatrizRotina } from '../data/rotinaSemanal';
import { formatarTempoMinutos } from '../utils/wmsCalculations';

interface DespachoAnalistaProps {
  atividades: AtividadeOperacional[];
  colaboradores: Colaborador[];
  metas: MetaAtividade[];
  onCriarDespacho: (dados: {
    nomeCompleto: string;
    cargo: CargoColaborador;
    equipe: string;
    setor: string;
    secao?: string;
    atividade: string;
    itensPrevistos: number;
    rua: string;
    observacao?: string;
    prioridade?: 'Normal' | 'Urgente' | 'Alta';
    analistaCriador: string;
  }) => void;
  onExcluirAtividade: (id: string) => void;
  onIrParaMobile: () => void;
}

export const DespachoAnalista: React.FC<DespachoAnalistaProps> = ({
  atividades,
  colaboradores,
  metas,
  onCriarDespacho,
  onExcluirAtividade,
  onIrParaMobile
}) => {
  // Estado do formulário de despacho
  const [analistaNome, setAnalistaNome] = useState('Lohan Rodrigues');
  const [colaboradorSelecionadoId, setColaboradorSelecionadoId] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('Separação');
  const [secaoSelecionada, setSecaoSelecionada] = useState<'Líquida' | 'Alimentar' | 'Bazar' | 'Limpeza' | 'Perfumaria' | 'Insumo'>('Alimentar');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState('Check de Picking C/Saldo Sem estoque');
  const [ruaSelecionada, setRuaSelecionada] = useState('Rua 04');
  const [itensPrevistos, setItensPrevistos] = useState<number>(60);
  const [prioridade, setPrioridade] = useState<'Normal' | 'Alta' | 'Urgente'>('Normal');
  const [observacao, setObservacao] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  // Filtros da Rotina Semanal
  const diaAtualNome = getDiaSemanaAtualNome();
  const [diaSelecionadoRotina, setDiaSelecionadoRotina] = useState(diaAtualNome);
  const [filtroSecaoRotina, setFiltroSecaoRotina] = useState<string>('todas');
  const [abaDespacho, setAbaDespacho] = useState<'rotina_dia' | 'formulario'>('rotina_dia');

  // Filtro do painel inferior
  const [filtroStatusTabela, setFiltroStatusTabela] = useState<'todos' | 'Pendente' | 'Em Andamento' | 'Concluído'>('todos');

  // Colaboradores de execução (Auxiliares e Assistentes)
  const executores = useMemo(() => {
    return colaboradores.filter(c => c.cargo === 'Auxiliar' || c.cargo === 'Assistente');
  }, [colaboradores]);

  // Colaborador atual selecionado
  const colaboradorAtual = useMemo(() => {
    return colaboradores.find(c => c.id === colaboradorSelecionadoId);
  }, [colaboradores, colaboradorSelecionadoId]);

  // Tarefas da rotina para o dia selecionado
  const tarefasRotinaDia = useMemo(() => {
    let lista = getMatrizPorDia(diaSelecionadoRotina);
    if (filtroSecaoRotina !== 'todas') {
      lista = lista.filter(t => t.secao === filtroSecaoRotina);
    }
    return lista;
  }, [diaSelecionadoRotina, filtroSecaoRotina]);

  // Handler de envio individual
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaboradorAtual) {
      alert('Selecione o auxiliar ou assistente responsável pela atividade.');
      return;
    }
    if (!atividadeSelecionada) {
      alert('Informe a atividade a ser executada.');
      return;
    }

    onCriarDespacho({
      nomeCompleto: colaboradorAtual.nome,
      cargo: colaboradorAtual.cargo,
      equipe: colaboradorAtual.equipe,
      setor: setorSelecionado,
      secao: secaoSelecionada,
      atividade: atividadeSelecionada,
      itensPrevistos: Number(itensPrevistos) || 0,
      rua: ruaSelecionada,
      observacao,
      prioridade,
      analistaCriador: analistaNome
    });

    setSucessoMsg(`Demanda enviada com sucesso para ${colaboradorAtual.nome}! O colaborador receberá no celular.`);
    setTimeout(() => setSucessoMsg(''), 5000);

    setObservacao('');
  };

  const handleAtribuirTarefaRotina = (tarefa: TarefaMatrizRotina) => {
    const candidato = executores.find(e => e.cargo === tarefa.cargoSugerido);
    if (candidato) {
      setColaboradorSelecionadoId(candidato.id);
    }
    setAtividadeSelecionada(tarefa.atividade);
    setSecaoSelecionada(tarefa.secao);
    setSetorSelecionado(tarefa.setorGeral);
    setItensPrevistos(tarefa.metaPadrao);
    setAbaDespacho('formulario');
  };

  const atividadesPendentes = useMemo(() => atividades.filter(a => a.status === 'Pendente'), [atividades]);
  const atividadesEmAndamento = useMemo(() => atividades.filter(a => a.status === 'Em Andamento'), [atividades]);
  const atividadesConcluidas = useMemo(() => atividades.filter(a => a.status === 'Concluído'), [atividades]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header do Módulo do Analista com fundo Azul e Branco */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-blue-950 tracking-tight">
              Despacho Operacional do Analista
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Distribua as tarefas da rotina semanal para Auxiliares e Assistentes no chão de armazém do CD MT Trevo.
          </p>
        </div>

        {/* Identificação do Analista */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-500">Analista Ativo:</span>
            <div className="font-bold text-blue-950">{analistaNome}</div>
          </div>
          <select
            value={analistaNome}
            onChange={(e) => setAnalistaNome(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
          >
            <option value="Lohan Rodrigues">Lohan Rodrigues (Analista WMS)</option>
            <option value="Roberto Santos">Roberto Santos (Analista Operações)</option>
          </select>
        </div>
      </div>

      {sucessoMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{sucessoMsg}</span>
          </div>
          <button onClick={onIrParaMobile} className="text-xs text-blue-800 font-bold underline hover:text-blue-900">
            Abrir Visão Mobile da Equipe →
          </button>
        </div>
      )}

      {/* Tabs: Rotina do Dia vs Formulário Manual */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAbaDespacho('rotina_dia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            abaDespacho === 'rotina_dia'
              ? 'bg-[#051336] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Rotina Diária por Seção ({diaSelecionadoRotina})</span>
        </button>

        <button
          onClick={() => setAbaDespacho('formulario')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            abaDespacho === 'formulario'
              ? 'bg-[#051336] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Formulário de Lançamento Direto</span>
        </button>
      </div>

      {/* ABA 1: ROTINA DIÁRIA POR SEÇÃO EM FUNDO BRANCO */}
      {abaDespacho === 'rotina_dia' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-blue-950 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                Matriz de Rotina Semanal do CD MT Trevo
              </h2>
              <p className="text-xs text-slate-500">
                Selecione o dia e a seção (Líquida, Alimentar, Bazar, Limpeza, Perfumaria, Insumo) para atribuir com 1 clique.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={diaSelecionadoRotina}
                onChange={(e) => setDiaSelecionadoRotina(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 font-bold"
              >
                <option value="Segunda-Feira">1 - Segunda-Feira</option>
                <option value="Terça-Feira">2 - Terça-Feira</option>
                <option value="Quarta-Feira">3 - Quarta-Feira</option>
                <option value="Quinta-Feira">4 - Quinta-Feira</option>
                <option value="Sexta-Feira">5 - Sexta-Feira</option>
              </select>

              <select
                value={filtroSecaoRotina}
                onChange={(e) => setFiltroSecaoRotina(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="todas">Todas as Seções</option>
                {SECOES_CD_MT.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de Tarefas da Rotina */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tarefasRotinaDia.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-900 border border-blue-200">
                      {t.secao}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Seq {t.seq} · {t.cargoSugerido}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-blue-900 transition-colors">
                    {t.atividade}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span>Setor: <strong className="text-slate-800">{t.setorGeral}</strong></span>
                    <span>·</span>
                    <span>Meta: <strong className="text-blue-950 font-mono">{t.metaPadrao} {t.unidade}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleAtribuirTarefaRotina(t)}
                  className="mt-3.5 w-full py-2 px-3 bg-white hover:bg-[#051336] hover:text-white text-blue-900 border border-slate-200 hover:border-transparent text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Atribuir para Equipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: FORMULÁRIO COMPLETO DE LANÇAMENTO EM FUNDO BRANCO */}
      {abaDespacho === 'formulario' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-blue-950 text-base">Novo Despacho de Atividade</h2>
              <p className="text-xs text-slate-500">Preencha os parâmetros e atribua a demanda ao auxiliar ou assistente.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* 1. Colaborador Responsável */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Colaborador (Auxiliar / Assistente) *
              </label>
              <select
                value={colaboradorSelecionadoId}
                onChange={(e) => setColaboradorSelecionadoId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="">Selecione o colaborador...</option>
                <optgroup label="Auxiliares de Logística">
                  {executores.filter(c => c.cargo === 'Auxiliar').map(c => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.equipe})</option>
                  ))}
                </optgroup>
                <optgroup label="Assistentes de Operações WMS">
                  {executores.filter(c => c.cargo === 'Assistente').map(c => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.equipe})</option>
                  ))}
                </optgroup>
              </select>
              {colaboradorAtual && (
                <p className="text-[11px] text-blue-800 font-semibold mt-1">
                  Cargo: <strong>{colaboradorAtual.cargo}</strong> · {colaboradorAtual.equipe}
                </p>
              )}
            </div>

            {/* 2. Seção do CD */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Seção Comercial / Setor1 *
              </label>
              <select
                value={secaoSelecionada}
                onChange={(e) => setSecaoSelecionada(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {SECOES_CD_MT.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 3. Atividade a ser Executada */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Atividade Realizada *
              </label>
              <input
                type="text"
                list="atividades-lista"
                value={atividadeSelecionada}
                onChange={(e) => setAtividadeSelecionada(e.target.value)}
                placeholder="Ex: Check de Picking C/Saldo Negativo"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <datalist id="atividades-lista">
                <option value="Check de Picking C/Saldo Negativo" />
                <option value="Check de Picking C/Saldo Sem estoque" />
                <option value="Check de Validade In Loco" />
                <option value="Check de Pulmão Vazio" />
                <option value="Check de Pulmão Disponível" />
                <option value="Check Pulmão Reservado" />
                <option value="Check Pulmão Bloqueado" />
                <option value="Check de Normas por Seção" />
                <option value="Inventario Rotativo" />
                <option value="Check de Picking Inativos (Disponibilizar)" />
                <option value="Ajuste Picking (Curva ABC)" />
                <option value="Check de Etiqueta de Longarinas" />
                <option value="Separação de Pedidos" />
                <option value="Conferência de Carga (Check)" />
                <option value="Armazenagem / Guarda" />
              </datalist>
            </div>

            {/* 4. Setor Geral */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Setor do Armazém
              </label>
              <select
                value={setorSelecionado}
                onChange={(e) => setSetorSelecionado(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                {SETORES_PADRAO.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 5. Rua (Check) */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Rua / Endereço (Check) *
              </label>
              <select
                value={ruaSelecionada}
                onChange={(e) => setRuaSelecionada(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono font-bold"
              >
                {RUAS_PADRAO.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 6. Itens Previstos */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Quantidade Prevista (Itens / Endereços)
              </label>
              <input
                type="number"
                min="1"
                value={itensPrevistos}
                onChange={(e) => setItensPrevistos(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono font-bold"
              />
            </div>

            {/* 7. Prioridade */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Prioridade
              </label>
              <div className="flex items-center gap-2">
                {(['Normal', 'Alta', 'Urgente'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrioridade(p)}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs border transition-colors ${
                      prioridade === p
                        ? p === 'Urgente'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : p === 'Alta'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-blue-900 text-white border-blue-950'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Observações */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Instruções / Observação para a Equipe
              </label>
              <input
                type="text"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Verificar paletes aéreos e conferir saldo do SKU 10429"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAbaDespacho('rotina_dia')}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#051336] hover:bg-[#0c2463] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Despachar Demanda para o Celular da Equipe</span>
            </button>
          </div>
        </form>
      )}

      {/* PAINEL DE CONTROLE DE DEMANDAS EM FUNDO BRANCO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-blue-950 text-base">
              Acompanhamento de Demandas em Tempo Real
            </h2>
            <p className="text-xs text-slate-500">
              Ciclo de retorno: Despacho do Analista → Início no Celular → Retorno Concluído.
            </p>
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFiltroStatusTabela('todos')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filtroStatusTabela === 'todos' ? 'bg-[#051336] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({atividades.length})
            </button>
            <button
              onClick={() => setFiltroStatusTabela('Pendente')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filtroStatusTabela === 'Pendente' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes ({atividadesPendentes.length})
            </button>
            <button
              onClick={() => setFiltroStatusTabela('Em Andamento')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filtroStatusTabela === 'Em Andamento' ? 'bg-sky-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Andamento ({atividadesEmAndamento.length})
            </button>
            <button
              onClick={() => setFiltroStatusTabela('Concluído')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filtroStatusTabela === 'Concluído' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídas ({atividadesConcluidas.length})
            </button>
          </div>
        </div>

        {/* Tabela de Demandas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Responsável</th>
                <th className="py-3 px-3">Atividade / Seção</th>
                <th className="py-3 px-3">Rua</th>
                <th className="py-3 px-3">Despacho</th>
                <th className="py-3 px-3">Início</th>
                <th className="py-3 px-3">Retorno</th>
                <th className="py-3 px-3">Tempo Retorno</th>
                <th className="py-3 px-3">Itens</th>
                <th className="py-3 px-3">Meta</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atividades
                .filter(a => filtroStatusTabela === 'todos' ? true : a.status === filtroStatusTabela)
                .map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Status */}
                    <td className="py-3 px-3">
                      {a.status === 'Pendente' && (
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                          Pendente
                        </span>
                      )}
                      {a.status === 'Em Andamento' && (
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                          Em celular
                        </span>
                      )}
                      {a.status === 'Concluído' && (
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Concluído
                        </span>
                      )}
                    </td>

                    {/* Responsável */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{a.nomeCompleto}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className={a.cargo === 'Assistente' ? 'text-sky-700 font-semibold' : 'text-blue-900 font-semibold'}>
                          {a.cargo}
                        </span>
                        <span>·</span>
                        <span>{a.equipe}</span>
                      </div>
                    </td>

                    {/* Atividade & Seção */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{a.atividade}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        {a.secao && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-900 font-bold border border-blue-200">
                            {a.secao}
                          </span>
                        )}
                        <span>{a.setor}</span>
                      </div>
                    </td>

                    {/* Rua */}
                    <td className="py-3 px-3 font-mono font-bold text-blue-900">
                      {a.rua}
                    </td>

                    {/* Hora Despacho */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {a.horaDespacho || '--:--'}
                    </td>

                    {/* Hora Início */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {a.horaInicio || '--:--'}
                    </td>

                    {/* Hora Retorno */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {a.horaRetorno || a.horaFim || '--:--'}
                    </td>

                    {/* Tempo Retorno */}
                    <td className="py-3 px-3">
                      {a.status === 'Concluído' ? (
                        <div className="font-mono font-black text-blue-900">
                          {a.tempoRetornoMinutos} min
                        </div>
                      ) : a.status === 'Em Andamento' ? (
                        <div className="font-mono text-sky-700 text-[11px] font-bold animate-pulse">
                          Executando...
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">
                          Aguardando início
                        </div>
                      )}
                    </td>

                    {/* Itens */}
                    <td className="py-3 px-3 font-mono">
                      <strong className="text-slate-900">{a.itens || 0}</strong>
                      {a.itensPrevistos ? (
                        <span className="text-[10px] text-slate-400"> / {a.itensPrevistos}</span>
                      ) : null}
                    </td>

                    {/* Meta */}
                    <td className="py-3 px-3">
                      {a.status === 'Concluído' ? (
                        <span className={`text-[11px] font-bold ${
                          a.statusMeta === 'Acima da Meta' ? 'text-emerald-700' :
                          a.statusMeta === 'Atingiu a Meta' ? 'text-sky-700' : 'text-rose-700'
                        }`}>
                          {a.statusMeta}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">--</span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Deseja cancelar esta demanda?')) {
                            onExcluirAtividade(a.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Cancelar / Excluir"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
