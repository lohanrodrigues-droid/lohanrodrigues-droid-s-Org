import React, { useState, useMemo } from 'react';
import {
  Scale,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  Boxes,
  MapPin,
  RefreshCw,
  Plus,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { DADOS_COMPARATIVO_ESTOQUE } from '../../data/mockHubEstoque';
import { ItemComparativoEstoque, SecaoComercial } from '../../types/hubEstoque';
import { getUrlPainel } from '../../utils/painelLinks';

interface PainelComparativoEstoqueProps {
  onVoltarParaHub?: () => void;
  onIrParaDespacho?: () => void;
  isStandalone?: boolean;
}

export const PainelComparativoEstoque: React.FC<PainelComparativoEstoqueProps> = ({
  onVoltarParaHub,
  onIrParaDespacho,
  isStandalone = false
}) => {
  const [itens, setItens] = useState<ItemComparativoEstoque[]>(DADOS_COMPARATIVO_ESTOQUE);
  const [busca, setBusca] = useState('');
  const [secaoFiltro, setSecaoFiltro] = useState<string>('Todas');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');
  const [faixaImpacto, setFaixaImpacto] = useState<string>('Todas');
  const [ruaFiltro, setRuaFiltro] = useState<string>('Todas');
  const [isModalNovoItemOpen, setIsModalNovoItemOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Form para nova contagem / conferência
  const [novoItem, setNovoItem] = useState({
    sku: '',
    descricao: '',
    secao: 'Alimentar' as SecaoComercial,
    rua: 'Rua 01',
    endereco: 'R01-N01-P01',
    estoqueWms: 100,
    estoqueConsinco: 100,
    estoqueFisico: 100,
    valorUnitario: 10.00,
    responsavelContagem: 'LOHAN RODRIGUES (Analista)'
  });

  const secoes = ['Todas', 'Líquida', 'Alimentar', 'Bazar', 'Limpeza', 'Perfumaria', 'Insumo'];
  const statusList = ['Todos', 'Acurado', 'Divergência Negativa', 'Divergência Positiva'];
  const ruas = ['Todas', ...Array.from(new Set(itens.map(i => i.rua))).sort()];

  const urlPropria = getUrlPainel('comparativo', true);

  const handleCopiarUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(urlPropria).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  // Cálculos consolidados
  const metricas = useMemo(() => {
    const totalItens = itens.length;
    const acurados = itens.filter(i => i.status === 'Acurado').length;
    const taxaAcuracidade = totalItens > 0 ? (acurados / totalItens) * 100 : 100;
    
    const totalDivergenciaUn = itens.reduce((acc, i) => acc + i.divergenciaUn, 0);
    const impactoTotal = itens.reduce((acc, i) => acc + i.impactoFinanceiro, 0);

    return {
      totalItens,
      acurados,
      taxaAcuracidade: taxaAcuracidade.toFixed(2),
      totalDivergenciaUn,
      impactoTotal: Math.abs(impactoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  }, [itens]);

  // Filtragem dos dados
  const itensFiltrados = useMemo(() => {
    return itens.filter(i => {
      const matchBusca =
        i.sku.toLowerCase().includes(busca.toLowerCase()) ||
        i.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        i.endereco.toLowerCase().includes(busca.toLowerCase()) ||
        i.rua.toLowerCase().includes(busca.toLowerCase());

      const matchSecao = secaoFiltro === 'Todas' || i.secao === secaoFiltro;
      const matchStatus = statusFiltro === 'Todos' || i.status === statusFiltro;
      const matchRua = ruaFiltro === 'Todas' || i.rua === ruaFiltro;

      let matchImpacto = true;
      const absImpacto = Math.abs(i.impactoFinanceiro);
      if (faixaImpacto === 'Alto') matchImpacto = absImpacto >= 500;
      else if (faixaImpacto === 'Medio') matchImpacto = absImpacto > 0 && absImpacto < 500;
      else if (faixaImpacto === 'Zero') matchImpacto = absImpacto === 0;

      return matchBusca && matchSecao && matchStatus && matchRua && matchImpacto;
    });
  }, [itens, busca, secaoFiltro, statusFiltro, ruaFiltro, faixaImpacto]);

  // Exportar para CSV
  const exportarCSV = () => {
    const cabecalho = 'SKU;Descrição;Seção;Rua;Endereço;WMS (un);Consinco ERP (un);Físico Contado (un);Divergência (un);Valor Unitário (R$);Impacto Financeiro (R$);Status;Última Contagem;Responsável\n';
    const linhas = itensFiltrados.map(i =>
      `"${i.sku}";"${i.descricao}";"${i.secao}";"${i.rua}";"${i.endereco}";${i.estoqueWms};${i.estoqueConsinco};${i.estoqueFisico};${i.divergenciaUn};${i.valorUnitario.toFixed(2)};${i.impactoFinanceiro.toFixed(2)};"${i.status}";"${i.dataUltimaContagem}";"${i.responsavelContagem}"`
    ).join('\n');

    const blob = new Blob(['\ufeff' + cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparativo_estoque_wms_consinco_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSalvarNovaContagem = (e: React.FormEvent) => {
    e.preventDefault();
    const divergencia = novoItem.estoqueFisico - novoItem.estoqueWms;
    const impacto = divergencia * novoItem.valorUnitario;
    let status: 'Acurado' | 'Divergência Negativa' | 'Divergência Positiva' = 'Acurado';
    if (divergencia < 0) status = 'Divergência Negativa';
    if (divergencia > 0) status = 'Divergência Positiva';

    const itemCriado: ItemComparativoEstoque = {
      id: `comp-${Date.now()}`,
      sku: novoItem.sku || 'SKU-AVULSO',
      descricao: novoItem.descricao || 'Item sem descrição',
      secao: novoItem.secao,
      rua: novoItem.rua,
      endereco: novoItem.endereco,
      estoqueWms: novoItem.estoqueWms,
      estoqueConsinco: novoItem.estoqueConsinco,
      estoqueFisico: novoItem.estoqueFisico,
      divergenciaUn: divergencia,
      valorUnitario: novoItem.valorUnitario,
      impactoFinanceiro: impacto,
      status,
      dataUltimaContagem: new Date().toISOString().replace('T', ' ').substring(0, 16),
      responsavelContagem: novoItem.responsavelContagem
    };

    setItens([itemCriado, ...itens]);
    setIsModalNovoItemOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Painel 03 · Auditoria de Estoque
            </span>
            <span className="text-xs text-slate-400">· WMS CD Trevo × Consinco ERP</span>
            {isStandalone && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Página Dedicada
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-blue-600" />
            <span>Comparativo de Estoque (WMS × ERP × Físico)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhamento de acuracidade por SKU e endereço, cálculo de divergências em unidades e impacto financeiro (R$).
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
            onClick={() => setIsModalNovoItemOpen(true)}
            className="py-2 px-3 text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Contagem</span>
          </button>
        </div>
      </div>

      {/* KPIs de Auditoria e Impacto Financeiro */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Acuracidade Global */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Acuracidade Global</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {metricas.taxaAcuracidade}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-700">Meta: ≥ 99.0%</span>
            <span>· Status: Atingida</span>
          </div>
        </div>

        {/* Valor Corte do Mês */}
        <div className="bg-[#051336] text-white p-5 rounded-xl border border-[#0d2259] shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-sky-300">
            <span className="font-bold uppercase tracking-wider">Valor Corte do Mês</span>
            <span className="text-amber-400">★ D-1</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            R$ 96.162,20
          </div>
          <div className="text-[11px] text-slate-300 flex items-center justify-between">
            <span>Impacto financeiro acumulado</span>
            <span className="text-rose-400 font-bold">-0.88% diverg.</span>
          </div>
        </div>

        {/* Divergência em Unidades */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Divergência em Unidades</span>
            <Boxes className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {metricas.totalDivergenciaUn > 0 ? `+${metricas.totalDivergenciaUn}` : metricas.totalDivergenciaUn} un
          </div>
          <div className="text-[11px] text-slate-500">
            Balanço líquido de contagens físicas no CD
          </div>
        </div>

        {/* SKUs Auditados */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">SKUs Verificados</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
              {metricas.acurados} acurados
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metricas.totalItens}
          </div>
          <div className="text-[11px] text-slate-500">
            Líquida, Alimentar, Bazar, Limpeza, Perfumaria
          </div>
        </div>

      </div>

      {/* Barra de Filtros Interativos do Comparativo */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filtros Interativos de Comparativo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Exibindo <strong>{itensFiltrados.length}</strong> de {itens.length} SKUs
            </span>
            <button
              onClick={exportarCSV}
              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Busca por SKU / Descrição */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Buscar SKU / Produto</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ex.: Coca, Arroz, 789..."
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

          {/* Filtro por Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status de Divergência</label>
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

          {/* Filtro por Faixa de Impacto Financeiro */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Impacto Financeiro</label>
            <select
              value={faixaImpacto}
              onChange={e => setFaixaImpacto(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              <option value="Todas">Todas as Faixas</option>
              <option value="Alto">Alto Impacto (&ge; R$ 500)</option>
              <option value="Medio">Médio Impacto (&lt; R$ 500)</option>
              <option value="Zero">Sem Divergência (R$ 0,00)</option>
            </select>
          </div>

          {/* Filtro por Rua */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Rua / Corredor</label>
            <select
              value={ruaFiltro}
              onChange={e => setRuaFiltro(e.target.value)}
              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
            >
              {ruas.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Comparativo por SKU */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051336] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">SKU / Produto</th>
                <th className="py-3 px-3">Seção / Endereço</th>
                <th className="py-3 px-3 text-center">WMS (un)</th>
                <th className="py-3 px-3 text-center">Consinco (un)</th>
                <th className="py-3 px-3 text-center">Físico (un)</th>
                <th className="py-3 px-3 text-center">Divergência</th>
                <th className="py-3 px-3 text-right">Impacto R$</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Contado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhum item encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                itensFiltrados.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-900 block">{item.descricao}</span>
                      <span className="text-[11px] text-slate-500 font-mono">EAN/SKU: {item.sku}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 inline-block mb-0.5">
                        {item.secao}
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono">{item.rua} · {item.endereco}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                      {item.estoqueWms}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                      {item.estoqueConsinco}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-900 bg-blue-50/50">
                      {item.estoqueFisico}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {item.divergenciaUn === 0 ? (
                        <span className="text-emerald-600 font-semibold">0 un</span>
                      ) : item.divergenciaUn < 0 ? (
                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          {item.divergenciaUn} un
                        </span>
                      ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          +{item.divergenciaUn} un
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {item.impactoFinanceiro === 0 ? (
                        <span className="text-slate-400">R$ 0,00</span>
                      ) : item.impactoFinanceiro < 0 ? (
                        <span className="text-rose-600">
                          -R$ {Math.abs(item.impactoFinanceiro).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-emerald-600">
                          +R$ {item.impactoFinanceiro.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status === 'Acurado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Acurado
                        </span>
                      ) : item.status === 'Divergência Negativa' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" /> Falta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Sobra
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="block text-slate-700 font-medium">{item.dataUltimaContagem}</span>
                      <span className="text-[10px] text-slate-400 truncate block max-w-[140px] ml-auto">
                        {item.responsavelContagem}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal para Registrar Nova Contagem Física */}
      {isModalNovoItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <span>Apontar Contagem Física</span>
              </h3>
              <button
                onClick={() => setIsModalNovoItemOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarNovaContagem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código SKU / EAN</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: 7891000100201"
                  value={novoItem.sku}
                  onChange={e => setNovoItem({ ...novoItem, sku: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: ARROZ TIPO 1 5KG"
                  value={novoItem.descricao}
                  onChange={e => setNovoItem({ ...novoItem, descricao: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seção Comercial</label>
                  <select
                    value={novoItem.secao}
                    onChange={e => setNovoItem({ ...novoItem, secao: e.target.value as SecaoComercial })}
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
                  <label className="block font-bold text-slate-700 mb-1">Endereço de Apanha</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: R04-N02-P10"
                    value={novoItem.endereco}
                    onChange={e => setNovoItem({ ...novoItem, endereco: e.target.value, rua: `Rua ${e.target.value.substring(1, 3)}` })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WMS (un)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={novoItem.estoqueWms}
                    onChange={e => setNovoItem({ ...novoItem, estoqueWms: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ERP Consinco (un)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={novoItem.estoqueConsinco}
                    onChange={e => setNovoItem({ ...novoItem, estoqueConsinco: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-800 mb-1">Físico Contado (un)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={novoItem.estoqueFisico}
                    onChange={e => setNovoItem({ ...novoItem, estoqueFisico: Number(e.target.value) })}
                    className="w-full p-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-900 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Valor Unitário (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={novoItem.valorUnitario}
                  onChange={e => setNovoItem({ ...novoItem, valorUnitario: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalNovoItemOpen(false)}
                  className="py-2 px-3.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Registrar Contagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
