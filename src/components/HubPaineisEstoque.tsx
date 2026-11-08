import React, { useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Building2,
  CheckSquare,
  Scale,
  AlertTriangle,
  Star,
  ExternalLink,
  FolderOpen,
  Boxes,
  Smartphone,
  Send,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Maximize2
} from 'lucide-react';
import { METRICAS_OCUPACAO_CD } from '../data/mockHubEstoque';
import { getUrlPainel, TipoPainelChave } from '../utils/painelLinks';

interface HubPaineisEstoqueProps {
  onNavegar: (aba: string) => void;
  pendentesCount: number;
  emAndamentoCount: number;
  concluidosHojeCount: number;
}

export const HubPaineisEstoque: React.FC<HubPaineisEstoqueProps> = ({
  onNavegar,
  pendentesCount,
  emAndamentoCount,
  concluidosHojeCount
}) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'grid'>('lista');
  const [filtroArea, setFiltroArea] = useState<'todas' | 'favoritas' | 'estoque'>('todas');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [linkCopiadoId, setLinkCopiadoId] = useState<string | null>(null);

  const paineis = [
    {
      id: 'ocupacao_cd',
      chave: 'ocupacao' as TipoPainelChave,
      destinoAba: 'ocupacao_cd',
      titulo: 'Ocupação do CD',
      subtitulo: 'Posições ocupadas, vagas e bloqueadas por rua com mapa de calor',
      icone: Building2,
      corIcone: 'text-sky-400 bg-sky-950/70 border-sky-800',
      badgeArea: 'Estoque',
      badgeStatus: 'Tempo Real',
      tipo: 'Capacidade & Armazenagem',
      filtrosInclusos: ['Seção Comercial', 'Tipo (Picking/Pulmão/Mez)', 'Faixa Ocupação', 'Ruas 01-24'],
      metricasDestaque: [
        { label: 'Ocupação', valor: `${METRICAS_OCUPACAO_CD.taxaOcupacaoGeral}%` },
        { label: 'Posições Totais', valor: METRICAS_OCUPACAO_CD.totalPosicoes.toLocaleString('pt-BR') },
        { label: 'Ruas > 90%', valor: `${METRICAS_OCUPACAO_CD.ruasCriticas} ruas` }
      ]
    },
    {
      id: 'painel',
      chave: 'rotinas' as TipoPainelChave,
      destinoAba: 'painel',
      titulo: 'WMS Rotinas / Execução',
      subtitulo: 'Central de Operação & Apontamento: Despacho Analista, Retorno Mobile, Ruas e Produtividade',
      icone: CheckSquare,
      corIcone: 'text-emerald-400 bg-emerald-950/70 border-emerald-800',
      badgeArea: 'Estoque',
      badgeStatus: 'Operação & Apontamento',
      tipo: 'Produtividade & Despacho',
      filtrosInclusos: ['Despacho PC', 'Retorno Mobile', 'Ruas 01-24', 'Ranking Aux/Assist', 'Matriz Semanal', 'Google Forms'],
      metricasDestaque: [
        { label: 'Concluídos Hoje', valor: `${concluidosHojeCount}` },
        { label: 'Em Andamento', valor: `${emAndamentoCount}` },
        { label: 'Pendentes', valor: `${pendentesCount}` }
      ]
    },
    {
      id: 'comparativo_estoque',
      chave: 'comparativo' as TipoPainelChave,
      destinoAba: 'comparativo_estoque',
      titulo: 'Comparativo de Estoque',
      subtitulo: 'WMS × ERP Consinco × Inventário Físico por SKU e endereço',
      icone: Scale,
      corIcone: 'text-blue-400 bg-blue-950/70 border-blue-800',
      badgeArea: 'Estoque',
      badgeStatus: 'Auditado',
      tipo: 'Auditoria & Acuracidade',
      filtrosInclusos: ['Seção Comercial', 'Tipo Divergência', 'Faixa Financeira', 'Rua / Endereço'],
      metricasDestaque: [
        { label: 'Acuracidade Global', valor: '99.12%' },
        { label: 'Valor Corte / Mês', valor: 'R$ 96.162,20' },
        { label: 'Divergência Unidades', valor: '-142 un' }
      ]
    },
    {
      id: 'divergencias_produtos',
      chave: 'divergencias' as TipoPainelChave,
      destinoAba: 'divergencias_produtos',
      titulo: 'Divergências de Produtos',
      subtitulo: 'Peso, quantidade, endereço e validade (Aging & Workflow)',
      icone: AlertTriangle,
      corIcone: 'text-amber-400 bg-amber-950/70 border-amber-800',
      badgeArea: 'Estoque',
      badgeStatus: 'Workflow Ativo',
      tipo: 'Qualidade & Shelf Life',
      filtrosInclusos: ['Tipo (Peso/Qtd/End/Val)', 'Status Workflow', 'Aging (<24h, >48h)', 'Seção'],
      metricasDestaque: [
        { label: 'Abertas / Em Validação', valor: '4 ativas' },
        { label: 'Aging Crítico (>48h)', valor: '2 itens' },
        { label: 'Resolvidas', valor: '1 hoje' }
      ]
    }
  ];

  const alternarFavorito = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const copiarLinkProprio = (chave: TipoPainelChave, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getUrlPainel(chave, true);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setLinkCopiadoId(id);
        setTimeout(() => setLinkCopiadoId(null), 2500);
      });
    }
  };

  const paineisFiltrados = paineis.filter(p => {
    const combinaBusca =
      p.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.subtitulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.tipo.toLowerCase().includes(termoBusca.toLowerCase());

    if (!combinaBusca) return false;

    if (filtroArea === 'favoritas') {
      return favoritos.includes(p.id);
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Banner de Boas-vindas GPFLOW com Identidade Azul Corporativa */}
      <div className="relative overflow-hidden rounded-2xl bg-[#051336] border border-[#1b2a52] text-white p-6 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 via-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Padrão GPFLOW · Perlog Logística
              </span>
              <span className="text-xs text-slate-400">· CD Trevo Mato Grosso</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hub de Gestão de Estoque
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Portal central com 4 painéis operacionais interativos. Cada painel conta com filtros dedicados e botão para <strong>abrir em página/aba separada com link próprio</strong>.
            </p>
          </div>

          {/* Atalhos Rápidos Operacionais */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavegar('despacho')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Despacho Analista</span>
            </button>
            <button
              onClick={() => onNavegar('retorno_mobile')}
              className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-slate-950" />
              <span>Retorno Mobile Equipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal com Menu Lateral de Filtros e Lista de Painéis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Painel Esquerdo de Filtros estilo GPFLOW */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#101a30] text-slate-200 border border-[#1b2a52] rounded-xl overflow-hidden shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 px-4 py-3 bg-[#051336] uppercase tracking-wider border-b border-[#1b2a52]">
              Filtros
            </div>
            <div className="p-3 space-y-1.5 text-xs font-medium">
              <button
                onClick={() => setFiltroArea('todas')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  filtroArea === 'todas'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-[#19243b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4" />
                  <span>Todas</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${filtroArea === 'todas' ? 'bg-blue-800 text-white' : 'bg-[#19243b] text-slate-400'}`}>
                  {paineis.length}
                </span>
              </button>

              <button
                onClick={() => setFiltroArea('favoritas')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  filtroArea === 'favoritas'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-[#19243b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Favoritas</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${filtroArea === 'favoritas' ? 'bg-blue-800 text-white' : 'bg-[#19243b] text-slate-400'}`}>
                  {favoritos.length}
                </span>
              </button>

              <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Áreas
              </div>

              <button
                onClick={() => setFiltroArea('estoque')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  filtroArea === 'estoque'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-[#19243b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-sky-400" />
                  <span>Estoque</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#19243b] text-slate-400">
                  {paineis.length}
                </span>
              </button>
            </div>
          </div>

          {/* Dica de Abertura em Nova Aba */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs text-blue-900 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span>Abertura em Nova Aba</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Use o botão <strong>“Abrir painel”</strong> para abrir cada painel em uma janela isolada com URL própria, ideal para monitores do CD ou navegação multitarefa.
            </p>
          </div>
        </div>

        {/* Área Central: Barra de Busca, Alternador e Lista de Painéis */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Barra Superior de Ações */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar painel de estoque..."
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              {termoBusca && (
                <button
                  onClick={() => setTermoBusca('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Alternador Lista / Grid */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] text-slate-500 font-medium">
                {paineisFiltrados.length} {paineisFiltrados.length === 1 ? 'painel' : 'painéis'}
              </span>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-0.5">
                <button
                  onClick={() => setVisualizacao('lista')}
                  title="Exibir em Lista"
                  className={`p-1.5 rounded-md transition-all ${
                    visualizacao === 'lista'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVisualizacao('grid')}
                  title="Exibir em Grade"
                  className={`p-1.5 rounded-md transition-all ${
                    visualizacao === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Estado Vazio de Busca */}
          {paineisFiltrados.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">Nenhum painel encontrado</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Não encontramos nenhum painel com os filtros ou termo de busca fornecidos.
              </p>
              <button
                onClick={() => {
                  setTermoBusca('');
                  setFiltroArea('todas');
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Visualização em LISTA */}
          {visualizacao === 'lista' && (
            <div className="space-y-3">
              {paineisFiltrados.map(painel => {
                const Icone = painel.icone;
                const isFav = favoritos.includes(painel.id);
                const urlPropria = getUrlPainel(painel.chave, true);
                const copiado = linkCopiadoId === painel.id;

                return (
                  <div
                    key={painel.id}
                    className="group bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Lado Esquerdo: Ícone + Título + Subtítulo + Tags de Filtros */}
                    <div
                      onClick={() => onNavegar(painel.destinoAba)}
                      className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-none border ${painel.corIcone} transition-transform group-hover:scale-105`}>
                        <Icone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {painel.titulo}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {painel.badgeArea}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            {painel.tipo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {painel.subtitulo}
                        </p>
                        
                        {/* Indicadores de Filtros Suportados */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold">Filtros:</span>
                          {painel.filtrosInclusos.map((f, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Centro: Métricas Chave do Painel */}
                    <div className="grid grid-cols-3 gap-3 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 flex-none text-center">
                      {painel.metricasDestaque.map((met, idx) => (
                        <div key={idx} className="px-1">
                          <span className="block text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {met.label}
                          </span>
                          <span className="block text-xs font-bold text-slate-800">
                            {met.valor}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Lado Direito: Botão "Abrir painel" (em nova aba) + Ações */}
                    <div className="flex items-center gap-2 justify-end flex-none pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Copiar Link Próprio */}
                      <button
                        onClick={(e) => copiarLinkProprio(painel.chave, painel.id, e)}
                        title="Copiar URL direta deste painel"
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all"
                      >
                        {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      {/* Favoritar */}
                      <button
                        onClick={(e) => alternarFavorito(painel.id, e)}
                        title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        className={`p-2 rounded-lg border transition-all ${
                          isFav
                            ? 'bg-amber-50 text-amber-500 border-amber-200'
                            : 'text-slate-400 hover:text-amber-500 border-slate-200 hover:border-amber-200'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Botão Solicitado: "Abrir painel" (abre em nova aba com link próprio) */}
                      <a
                        href={urlPropria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        title={`Abrir ${painel.titulo} em uma nova aba com URL própria`}
                      >
                        <span>Abrir painel</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Visualização em GRADE */}
          {visualizacao === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paineisFiltrados.map(painel => {
                const Icone = painel.icone;
                const isFav = favoritos.includes(painel.id);
                const urlPropria = getUrlPainel(painel.chave, true);
                const copiado = linkCopiadoId === painel.id;

                return (
                  <div
                    key={painel.id}
                    className="group bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-blue-300 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${painel.corIcone}`}>
                          <Icone className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => copiarLinkProprio(painel.chave, painel.id, e)}
                            title="Copiar URL direta"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => alternarFavorito(painel.id, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFav
                                ? 'bg-amber-50 text-amber-500 border-amber-200'
                                : 'text-slate-400 hover:text-amber-500 border-slate-200'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {painel.badgeArea}
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onNavegar(painel.destinoAba)}
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {painel.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {painel.subtitulo}
                      </p>

                      {/* Filtros Suportados */}
                      <div className="flex items-center gap-1 flex-wrap mt-2.5">
                        {painel.filtrosInclusos.map((f, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      {painel.metricasDestaque.map((met, idx) => (
                        <div key={idx}>
                          <span className="block text-[10px] text-slate-400">{met.label}</span>
                          <span className="block text-xs font-bold text-slate-800">{met.valor}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => onNavegar(painel.destinoAba)}
                        className="text-slate-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1"
                      >
                        <span>Ver aqui</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Botão Solicitado: "Abrir painel" */}
                      <a
                        href={urlPropria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <span>Abrir painel</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
