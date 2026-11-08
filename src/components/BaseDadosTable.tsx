import React, { useState, useMemo, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  Search,
  Filter,
  Trash2,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AtividadeOperacional, CargoColaborador } from '../types/wms';
import { wmsStorage } from '../services/wmsStorage';

interface BaseDadosTableProps {
  atividades: AtividadeOperacional[];
  onAtualizarLista: () => void;
  onExcluir: (id: string) => void;
  onNovoLancamento: () => void;
}

export const BaseDadosTable: React.FC<BaseDadosTableProps> = ({
  atividades,
  onAtualizarLista,
  onExcluir,
  onNovoLancamento
}) => {
  const [busca, setBusca] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('todos');
  const [filtroEquipe, setFiltroEquipe] = useState('todas');
  const [filtroSetor, setFiltroSetor] = useState('todos');
  const [filtroStatusMeta, setFiltroStatusMeta] = useState('todos');
  const [pagina, setPagina] = useState(1);
  const ITENS_POR_PAGINA = 15;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtradas = useMemo(() => {
    return atividades.filter(a => {
      if (filtroCargo !== 'todos' && a.cargo !== filtroCargo) return false;
      if (filtroEquipe !== 'todas' && a.equipe !== filtroEquipe) return false;
      if (filtroSetor !== 'todos' && a.setor !== filtroSetor) return false;
      if (filtroStatusMeta !== 'todos' && a.statusMeta !== filtroStatusMeta) return false;

      if (busca) {
        const termo = busca.toLowerCase();
        return (
          a.nomeCompleto.toLowerCase().includes(termo) ||
          a.atividade.toLowerCase().includes(termo) ||
          a.rua.toLowerCase().includes(termo) ||
          (a.secao && a.secao.toLowerCase().includes(termo)) ||
          (a.observacao && a.observacao.toLowerCase().includes(termo))
        );
      }
      return true;
    });
  }, [atividades, busca, filtroCargo, filtroEquipe, filtroSetor, filtroStatusMeta]);

  const totalPaginas = Math.ceil(filtradas.length / ITENS_POR_PAGINA) || 1;
  const exibidas = useMemo(() => {
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    return filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [filtradas, pagina]);

  const handleExportarCSV = () => {
    const csvContent = wmsStorage.exportarParaCSV(filtradas);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WMS_CD_MT_TREVO_Lancamentos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportarCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const count = wmsStorage.importarCSV(text);
        alert(`${count} lançamentos foram importados com sucesso!`);
        onAtualizarLista();
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header com Ações em Azul e Branco */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-blue-950 tracking-tight">
              Base de Dados Operacional (Compatível Google Forms)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualização em grade completa de todas as atividades com cálculo de Tempo, Metas, Turnaround de Retorno e exportação para Planilhas.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportarCSV}
            accept=".csv,.txt"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
            title="Importar planilha do Google Forms / Sheets"
          >
            <Upload className="w-3.5 h-3.5 text-blue-700" />
            <span>Importar CSV</span>
          </button>

          <button
            onClick={handleExportarCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            title="Exportar no formato da planilha do Forms"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Excel / CSV</span>
          </button>

          <button
            onClick={onNovoLancamento}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#051336] hover:bg-[#0c2463] text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por colaborador, atividade, rua, seção..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Cargo */}
        <select
          value={filtroCargo}
          onChange={(e) => {
            setFiltroCargo(e.target.value);
            setPagina(1);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todos">Todos os Cargos</option>
          <option value="Auxiliar">Auxiliares</option>
          <option value="Assistente">Assistentes</option>
        </select>

        {/* Equipe */}
        <select
          value={filtroEquipe}
          onChange={(e) => {
            setFiltroEquipe(e.target.value);
            setPagina(1);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todas">Todas as Equipes</option>
          <option value="Equipe A (Manhã)">Equipe A (Manhã)</option>
          <option value="Equipe B (Tarde)">Equipe B (Tarde)</option>
          <option value="Equipe C (Noite)">Equipe C (Noite)</option>
        </select>

        {/* Setor */}
        <select
          value={filtroSetor}
          onChange={(e) => {
            setFiltroSetor(e.target.value);
            setPagina(1);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todos">Todos os Setores</option>
          <option value="Separação">Separação</option>
          <option value="Conferência">Conferência</option>
          <option value="Armazenagem">Armazenagem</option>
          <option value="Recebimento">Recebimento</option>
          <option value="Expedição">Expedição</option>
          <option value="Reabastecimento">Reabastecimento</option>
          <option value="Inventário">Inventário</option>
        </select>

        {/* Status Meta */}
        <select
          value={filtroStatusMeta}
          onChange={(e) => {
            setFiltroStatusMeta(e.target.value);
            setPagina(1);
          }}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="todos">Todos os Status de Meta</option>
          <option value="Acima da Meta">Acima da Meta</option>
          <option value="Atingiu a Meta">Atingiu a Meta</option>
          <option value="Abaixo da Meta">Abaixo da Meta</option>
        </select>
      </div>

      {/* Grid de Dados em Fundo Branco */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Carimbo Data/Hora</th>
                <th className="py-3 px-3">Nome Completo</th>
                <th className="py-3 px-3">Cargo</th>
                <th className="py-3 px-3">Equipe</th>
                <th className="py-3 px-3">Setor</th>
                <th className="py-3 px-3">Seção</th>
                <th className="py-3 px-3">Atividades Realizadas</th>
                <th className="py-3 px-3">Itens</th>
                <th className="py-3 px-3">Rua (Check)</th>
                <th className="py-3 px-3">Hora Início</th>
                <th className="py-3 px-3">Hora Fim</th>
                <th className="py-3 px-3">Tempo Execução</th>
                <th className="py-3 px-3">Tempo Retorno</th>
                <th className="py-3 px-3">Meta</th>
                <th className="py-3 px-3">Status Meta</th>
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Dia da Semana</th>
                <th className="py-3 px-3">Observação</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {exibidas.length === 0 ? (
                <tr>
                  <td colSpan={19} className="py-8 text-center text-slate-400 text-xs font-sans">
                    Nenhum lançamento encontrado para os filtros ativos.
                  </td>
                </tr>
              ) : (
                exibidas.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] font-sans">
                      {a.carimboDataHora}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                      {a.nomeCompleto}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        a.cargo === 'Assistente' ? 'bg-sky-50 text-sky-800' : 'bg-blue-50 text-blue-900'
                      }`}>
                        {a.cargo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">
                      {a.equipe}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">
                      {a.setor}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      {a.secao ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          {a.secao}
                        </span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-sans max-w-xs truncate font-medium">
                      {a.atividade}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-950">
                      {a.itens || 0}
                    </td>
                    <td className="py-2.5 px-3 text-blue-800 font-bold">
                      {a.rua}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {a.horaInicio || '--:--'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {a.horaFim || '--:--'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {a.tempoFormatado || '--'}
                    </td>
                    <td className="py-2.5 px-3 text-blue-900 font-bold">
                      {a.tempoRetornoMinutos ? `${a.tempoRetornoMinutos}m` : '--'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {a.metaCalculada || '--'}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.statusMeta === 'Acima da Meta' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        a.statusMeta === 'Atingiu a Meta' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {a.statusMeta}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">
                      {a.data}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans">
                      {a.diaSemana}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-sans max-w-xs truncate" title={a.observacao}>
                      {a.observacao || '--'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir o lançamento de ${a.nomeCompleto}?`)) {
                            onExcluir(a.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé com Paginação */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            Mostrando <strong>{exibidas.length}</strong> de <strong>{filtradas.length}</strong> registros
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPagina(prev => Math.max(1, prev - 1))}
              disabled={pagina === 1}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 text-slate-700 font-bold hover:bg-slate-100 shadow-2xs"
            >
              Anterior
            </button>
            <span className="px-2 font-mono text-slate-800">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(prev => Math.min(totalPaginas, prev + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 text-slate-700 font-bold hover:bg-slate-100 shadow-2xs"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
