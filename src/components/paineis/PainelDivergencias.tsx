import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  Scale,
  Calendar,
  MapPin,
  Boxes,
  User,
  History,
  ArrowRight,
  MessageSquare,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { DIVERGENCIAS_PRODUTOS_INICIAIS } from '../../data/mockHubEstoque';
import {
  DivergenciaProduto,
  SecaoComercial,
  StatusDivergencia,
  TipoDivergencia
} from '../../types/hubEstoque';
import { getUrlPainel } from '../../utils/painelLinks';

interface PainelDivergenciasProps {
  onVoltarParaHub?: () => void;
  onIrParaDespacho?: () => void;
  isStandalone?: boolean;
}

export const PainelDivergencias: React.FC<PainelDivergenciasProps> = ({
  onVoltarParaHub,
  onIrParaDespacho,
  isStandalone = false
}) => {
  const [divergencias, setDivergencias] = useState<DivergenciaProduto[]>(DIVERGENCIAS_PRODUTOS_INICIAIS);
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('Todos');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');
  const [secaoFiltro, setSecaoFiltro] = useState<string>('Todas');
  const [agingFiltro, setAgingFiltro] = useState<string>('Todas');
  const [itemSelecionado, setItemSelecionado] = useState<DivergenciaProduto | null>(DIVERGENCIAS_PRODUTOS_INICIAIS[0]);
  const [isModalNovaDivergenciaOpen, setIsModalNovaDivergenciaOpen] = useState(false);
  const [notaTratativa, setNotaTratativa] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Formulário de nova divergência
  const [novaDiv, setNovaDiv] = useState({
    sku: '',
    descricao: '',
    secao: 'Alimentar' as SecaoComercial,
    tipo: 'Peso' as TipoDivergencia,
    endereco: 'R04-N02-P10',
    valorEsperado: '',
    valorIdentificado: '',
    diferenca: '',
    responsavel: 'LOHAN RODRIGUES (Analista)'
  });

  const tipos = ['Todos', 'Peso', 'Quantidade', 'Endereço', 'Validade / Shelf Life'];
  const statusList = ['Todos', 'Aberta', 'Em Validação', 'Resolvida'];
  const secoes = ['Todas', 'Líquida', 'Alimentar', 'Bazar', 'Limpeza', 'Perfumaria', 'Insumo'];

  const urlPropria = getUrlPainel('divergencias', true);

  const handleCopiarUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(urlPropria).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  // Contadores
  const contadores = useMemo(() => {
    return {
      total: divergencias.length,
      abertas: divergencias.filter(d => d.status === 'Aberta').length,
      emValidacao: divergencias.filter(d => d.status === 'Em Validação').length,
      resolvidas: divergencias.filter(d => d.status === 'Resolvida').length,
      criticasAging: divergencias.filter(d => d.status !== 'Resolvida' && d.tempoAbertoHoras >= 48).length
    };
  }, [divergencias]);

  const divergenciasFiltradas = useMemo(() => {
    return divergencias.filter(d => {
      const matchBusca =
        d.sku.toLowerCase().includes(busca.toLowerCase()) ||
        d.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        d.endereco.toLowerCase().includes(busca.toLowerCase()) ||
        d.rua.toLowerCase().includes(busca.toLowerCase());

      const matchTipo = tipoFiltro === 'Todos' || d.tipo === tipoFiltro;
      const matchStatus = statusFiltro === 'Todos' || d.status === statusFiltro;
      const matchSecao = secaoFiltro === 'Todas' || d.secao === secaoFiltro;

      let matchAging = true;
      if (agingFiltro === '<24h') matchAging = d.tempoAbertoHoras < 24;
      else if (agingFiltro === '24h-48h') matchAging = d.tempoAbertoHoras >= 24 && d.tempoAbertoHoras < 48;
      else if (agingFiltro === '>48h') matchAging = d.tempoAbertoHoras >= 48;

      return matchBusca && matchTipo && matchStatus && matchSecao && matchAging;
    });
  }, [divergencias, busca, tipoFiltro, statusFiltro, secaoFiltro, agingFiltro]);

  const getCorAging = (faixa: string) => {
    if (faixa === '< 24h') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (faixa === '24h - 48h') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getIconeTipo = (tipo: TipoDivergencia) => {
    switch (tipo) {
      case 'Peso':
        return <Scale className="w-4 h-4 text-purple-600" />;
      case 'Quantidade':
        return <Boxes className="w-4 h-4 text-blue-600" />;
      case 'Endereço':
        return <MapPin className="w-4 h-4 text-amber-600" />;
      case 'Validade / Shelf Life':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    }
  };

  // Avançar status do workflow
  const handleAvancarStatus = (novoStatus: StatusDivergencia) => {
    if (!itemSelecionado) return;

    const dataAtual = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const novoHistorico = [
      ...itemSelecionado.historico,
      {
        data: dataAtual,
        usuario: 'Lohan Rodrigues',
        acao: `Status alterado para "${novoStatus}"`,
        observacao: notaTratativa.trim() || undefined
      }
    ];

    const itemAtualizado: DivergenciaProduto = {
      ...itemSelecionado,
      status: novoStatus,
      responsavelTratativa: 'LOHAN RODRIGUES (Analista)',
      historico: novoHistorico
    };

    setDivergencias(divergencias.map(d => d.id === itemAtualizado.id ? itemAtualizado : d));
    setItemSelecionado(itemAtualizado);
    setNotaTratativa('');
  };

  // Adicionar nova divergência
  const handleCriarDivergencia = (e: React.FormEvent) => {
    e.preventDefault();
    const dataAtual = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const ruaExtraida = `Rua ${novaDiv.endereco.substring(1, 3)}`;

    const nova: DivergenciaProduto = {
      id: `div-${Date.now()}`,
      sku: novaDiv.sku || 'SKU-000',
      descricao: novaDiv.descricao || 'Produto sem descrição',
      secao: novaDiv.secao,
      tipo: novaDiv.tipo,
      endereco: novaDiv.endereco,
      rua: ruaExtraida,
      valorEsperado: novaDiv.valorEsperado,
      valorIdentificado: novaDiv.valorIdentificado,
      diferenca: novaDiv.diferenca,
      dataAbertura: dataAtual,
      tempoAbertoHoras: 0,
      agingFaixa: '< 24h',
      responsavelAbertura: novaDiv.responsavel,
      status: 'Aberta',
      historico: [
        {
          data: dataAtual,
          usuario: novaDiv.responsavel,
          acao: 'Divergência registrada no Hub de Estoque MT.'
        }
      ]
    };

    setDivergencias([nova, ...divergencias]);
    setItemSelecionado(nova);
    setIsModalNovaDivergenciaOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Painel 04 · Qualidade & Conformidade
            </span>
            <span className="text-xs text-slate-400">· CD Trevo Mato Grosso</span>
            {isStandalone && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Página Dedicada
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <span>Divergências de Produtos (Aging & Workflow)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Controle de anomalias em peso, quantidade, endereço e validade (Shelf Life) com histórico e tratativa.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          
          {/* Copiar Link */}
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

          <button
            onClick={() => setIsModalNovaDivergenciaOpen(true)}
            className="py-2 px-3 text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Divergência</span>
          </button>
        </div>
      </div>

      {/* KPIs de Status e Aging */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Abertas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Divergências Abertas</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {contadores.abertas}
          </div>
          <div className="text-[11px] text-slate-500">
            Aguardando início de validação
          </div>
        </div>

        {/* Em Validação */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Em Validação</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {contadores.emValidacao}
          </div>
          <div className="text-[11px] text-slate-500">
            Equipe checando in loco no CD
          </div>
        </div>

        {/* Aging Crítico */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Aging &gt; 48 Horas</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
            {contadores.criticasAging}
          </div>
          <div className="text-[11px] text-rose-600 font-medium">
            ⚠️ Necessita escalonamento analista
          </div>
        </div>

        {/* Resolvidas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Resolvidas / Tratadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {contadores.resolvidas}
          </div>
          <div className="text-[11px] text-slate-500">
            Cadastros e estoques corrigidos
          </div>
        </div>

      </div>

      {/* Barra de Filtros Interativos de Divergências */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filtros Interativos de Anomalias & Qualidade</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Exibindo <strong>{divergenciasFiltradas.length}</strong> de {divergencias.length} ocorrências
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Busca Geral */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Buscar SKU / Endereço</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ex.: OMO, R11, 789..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Filtro por Tipo de Anomalia */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tipo de Anomalia</label>
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

          {/* Filtro por Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status Workflow</label>
            <select
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              {statusList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Faixa de Aging */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Faixa de Aging (Horas)</label>
            <select
              value={agingFiltro}
              onChange={e => setAgingFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="Todas">Todas as Faixas</option>
              <option value="<24h">Menos de 24h</option>
              <option value="24h-48h">24h a 48h</option>
              <option value=">48h">⚠️ Acima de 48h (Crítico)</option>
            </select>
          </div>

          {/* Filtro por Seção Comercial */}
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
        </div>
      </div>

      {/* Grid: Lista de Divergências + Painel de Tratativa / Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Lista de Divergências (7 colunas) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ocorrências Registradas ({divergenciasFiltradas.length})
            </h3>
            <span className="text-[11px] text-slate-400">Clique para inspecionar</span>
          </div>

          {/* Lista de Itens */}
          {divergenciasFiltradas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhuma anomalia encontrada com os filtros ativos.
            </div>
          ) : (
            <div className="space-y-2.5">
              {divergenciasFiltradas.map(d => {
                const isSelected = itemSelecionado?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setItemSelecionado(d)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                          {getIconeTipo(d.tipo)}
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">{d.descricao}</span>
                          <span className="text-[11px] text-slate-500 font-mono">SKU: {d.sku}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-none">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCorAging(d.agingFaixa)}`}>
                          {d.tempoAbertoHoras}h aberto
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'Aberta'
                            ? 'bg-rose-100 text-rose-800'
                            : d.status === 'Em Validação'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes da Anomalia */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Endereço / Seção:</span>
                        <span className="font-bold text-slate-700">{d.endereco} ({d.secao})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Divergência:</span>
                        <span className="font-bold text-rose-700">{d.diferenca}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Lado Direito: Detalhamento, Histórico e Ação de Tratativa (5 colunas) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {itemSelecionado ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Tipo: {itemSelecionado.tipo}
                    </span>
                    <span className="text-[11px] text-slate-400">Aging: {itemSelecionado.tempoAbertoHoras}h</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                    {itemSelecionado.descricao}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  itemSelecionado.status === 'Aberta'
                    ? 'bg-rose-100 text-rose-800'
                    : itemSelecionado.status === 'Em Validação'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {itemSelecionado.status}
                </span>
              </div>

              {/* Informações Técnicas */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Endereço Atual:</span>
                  <span className="font-bold text-slate-800 font-mono">{itemSelecionado.endereco}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Valor Esperado (Sistema):</span>
                  <span className="font-semibold text-slate-700">{itemSelecionado.valorEsperado}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Valor Identificado (Físico):</span>
                  <span className="font-bold text-rose-700">{itemSelecionado.valorIdentificado}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Responsável Abertura:</span>
                  <span className="font-semibold text-slate-700">{itemSelecionado.responsavelAbertura}</span>
                </div>
                {itemSelecionado.responsavelTratativa && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Responsável Tratativa:</span>
                    <span className="font-semibold text-blue-700">{itemSelecionado.responsavelTratativa}</span>
                  </div>
                )}
              </div>

              {/* Ações de Workflow (Mudar Status) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Fluxo de Tratativa & Resolução:</span>
                
                <input
                  type="text"
                  placeholder="Observação da tratativa / ação tomada..."
                  value={notaTratativa}
                  onChange={e => setNotaTratativa(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                />

                <div className="flex flex-wrap items-center gap-2">
                  {itemSelecionado.status === 'Aberta' && (
                    <button
                      onClick={() => handleAvancarStatus('Em Validação')}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-all"
                    >
                      Iniciar Validação In Loco
                    </button>
                  )}

                  {itemSelecionado.status !== 'Resolvida' && (
                    <button
                      onClick={() => handleAvancarStatus('Resolvida')}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all"
                    >
                      Concluir / Resolver
                    </button>
                  )}

                  {itemSelecionado.status === 'Resolvida' && (
                    <button
                      onClick={() => handleAvancarStatus('Aberta')}
                      className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Reabrir Anomalia
                    </button>
                  )}
                </div>
              </div>

              {/* Linha do Tempo / Histórico de Auditoria */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Histórico da Ocorrência</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto text-[11px]">
                  {itemSelecionado.historico.map((h, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-600">{h.usuario}</span>
                        <span>{h.data}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{h.acao}</p>
                      {h.observacao && (
                        <p className="text-slate-600 italic bg-white p-1 rounded border border-slate-200 mt-1">
                          "{h.observacao}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Selecione uma divergência para visualizar o histórico e tratativa.
            </div>
          )}
        </div>

      </div>

      {/* Modal para Abrir Nova Divergência */}
      {isModalNovaDivergenciaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Registrar Nova Divergência de Produto</span>
              </h3>
              <button
                onClick={() => setIsModalNovaDivergenciaOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCriarDivergencia} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Anomalia</label>
                <select
                  value={novaDiv.tipo}
                  onChange={e => setNovaDiv({ ...novaDiv, tipo: e.target.value as TipoDivergencia })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                >
                  <option value="Peso">Peso (Divergência de pesagem / cubagem)</option>
                  <option value="Quantidade">Quantidade (Sobra ou Falta física)</option>
                  <option value="Endereço">Endereço (Produto em localização divergente)</option>
                  <option value="Validade / Shelf Life">Validade / Shelf Life (Lote crítico)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Código SKU / EAN</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: 7891024132042"
                  value={novaDiv.sku}
                  onChange={e => setNovaDiv({ ...novaDiv, sku: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: SABÃO EM PÓ OMO 1.6KG"
                  value={novaDiv.descricao}
                  onChange={e => setNovaDiv({ ...novaDiv, descricao: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seção Comercial</label>
                  <select
                    value={novaDiv.secao}
                    onChange={e => setNovaDiv({ ...novaDiv, secao: e.target.value as SecaoComercial })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  >
                    <option value="Líquida">Líquida</option>
                    <option value="Alimentar">Alimentar</option>
                    <option value="Bazar">Bazar</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Perfumaria">Perfumaria</option>
                    <option value="Insumo">Insumo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Endereço Físico</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: R11-N03-P22"
                    value={novaDiv.endereco}
                    onChange={e => setNovaDiv({ ...novaDiv, endereco: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Esperado (Cadastro)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: 1.600 kg/un"
                    value={novaDiv.valorEsperado}
                    onChange={e => setNovaDiv({ ...novaDiv, valorEsperado: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Identificado (Físico)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: 1.420 kg/un"
                    value={novaDiv.valorIdentificado}
                    onChange={e => setNovaDiv({ ...novaDiv, valorIdentificado: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumo da Diferença</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: -180g por unidade no pallet"
                  value={novaDiv.diferenca}
                  onChange={e => setNovaDiv({ ...novaDiv, diferenca: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalNovaDivergenciaOpen(false)}
                  className="py-2 px-3.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Registrar Divergência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
